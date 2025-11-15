import {RegisterBank} from "../registers/register-bank.js";
import {CpuDisplay} from "../ui/cpuDisplay.js"
import {archFromString} from "../architecture/architecture.js";
import {extractCode, isValidCodeLine} from "./parser.js";
import {ExecutorFactory} from "./executor/executorFactory.js";
import {getCpuTypeForAttribute} from "../types/cpuTypes.js";
import {initTitleButtonListener} from "../ui/cpuSidebar.js";
import {system} from "../../system.js";
import {regsConfigForArch} from "../architecture/regs/regConfigs.js";
import {getProgram} from "../editor/programs/programs.js";

class CPU extends EventTarget {
    constructor(cpuElem) {
        super();
        this.cpuElem = cpuElem;
        const cpuTypeAttr = cpuElem.getAttribute('data-cpu-type');

        const cpuType = getCpuTypeForAttribute(cpuTypeAttr);

        this.archType = cpuType.arch;
        this.architecture = archFromString(this.archType);
        this.invalidInstructions = cpuType.invalidInstructions;
        this.executionTime = cpuType.executionTime;

        this.stepping = false;

        this.editor = cpuElem.querySelector('[data-role="editor"]');
        this.runBtn = cpuElem.querySelector('[data-role="runBtn"]');
        this.stopBtn = cpuElem.querySelector('[data-role="stopBtn"]');
        this.stepBtn = cpuElem.querySelector('[data-role="stepBtn"]');

        this.registerBank = new RegisterBank(regsConfigForArch(this.archType));

        this.display = new CpuDisplay(this);
        this.executor = ExecutorFactory.fromCPU(this);

        const programAttr = cpuElem.getAttribute('data-program');
        if(programAttr) {
            const programCode = getProgram(programAttr);
            if(programCode) {
                this.editor.innerHTML = getProgram(programAttr);
                this.display.editorHandler.updateHighlight();
            }

        }

    }

    initButtonListeners() {
        this.runBtn.addEventListener('click', () => {
            system.runCpus();
        });
        this.stepBtn.addEventListener('click', () => {
            system.stepCpus();
        });
        this.stopBtn.addEventListener('click', () => {
            system.stopCpus();
        })

        initTitleButtonListener(this.cpuElem);
    }

    // in the future, this can generate actual code in memory when compiling
    testCode() {
        const lines = this.getCodeLines();
        const errors = [];

        lines.forEach((line, index) => {
            if (!isValidCodeLine(line, this)) {
                errors.push(index);
            }
        });

        if (errors.length > 0) {
            this.dispatchEvent(new CustomEvent('cpu-errors', { detail: { errors } }));
            return false;
        }
        return true;
    }


    nextStep() {
        if(!this.stepping) {
            this.display.editorHandler.lockEditor();
            if(!this.testCode()) {
                this.runBtn.disabled = true;
                this.stepBtn.disabled = true;
                return;
            }
            this.stepping = true;
            system.memReset();
        }
        const lines = this.getCodeLines();
        this.executor.runStep(lines);
    }


    async executeAll() {
        const lines = this.getCodeLines();

        this.runBtn.disabled = true;
        this.stepBtn.disabled = true;
        this.display.editorHandler.lockEditor();
        if(!this.testCode())
            return;

        try {
            await this.executor.runAll(lines);
        } catch (e) {
            console.warn('error:' + e)
        }
    }

    stop() {
        this.stepping = false;

        this.dispatchEvent(new CustomEvent('cpu-stop', {}));
        this.runBtn.disabled = false;
        this.stepBtn.disabled = false;
        this.display.editorHandler.unlockEditor();
        this.executor.stop();
        this.reset();
    }

    cleanup() {
        this.runBtn.disabled = false;
        this.stepBtn.disabled = false;
        this.display.editorHandler.unlockEditor();
    }

    getCodeLines() {
        let code = this.editor.value;
        code = extractCode(code);
        return code.split('\n');
    }

    reset() {
        this.registerBank.reset();
        this.display.reset();
    }

    getReg(name) {
        return this.registerBank.get(name);
    }

    getRegDisplay(name) {
        return this.registerBank.getDisplay(name);
    }

    setReg(name, val) {
        this.registerBank.set(name, val);
        this.dispatchEvent(new CustomEvent('reg-changed', {detail: {name, val}}));
    }

    getCpuElem() {
        return this.cpuElem;
    }

    get allowedOperations() {
        return [...this.architecture.operations].filter(
            op => !this.invalidInstructions.includes(op)
        );
    }

}

export default CPU;