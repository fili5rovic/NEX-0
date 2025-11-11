import {RegisterBank} from "../registers/register-bank.js";
import {CpuDisplay} from "../ui/cpuDisplay.js"
import {archFromString} from "../architecture/architecture.js";
import {extractCode} from "./parser.js";
import {ExecutorFactory} from "./executor/executorFactory.js";
import {getCpuTypeForAttribute} from "../types/cpuTypes.js";
import {initTitleButtonListener} from "../ui/cpuSidebar.js";
import {System} from "../../system.js";
import {regsConfigForArch} from "../architecture/regs/regConfigs.js";

class CPU extends EventTarget {
    constructor(cpuElem) {
        super();
        this.cpuElem = cpuElem;
        const cpuTypeAttr = cpuElem.getAttribute('data-cpu-type');

        const cpuType = getCpuTypeForAttribute(cpuTypeAttr);

        this.archType = cpuType.arch;
        this.architecture = archFromString(this.archType);
        this.executionTime = cpuType.executionTime;

        this.editor = cpuElem.querySelector('[data-role="editor"]');
        this.runBtn = cpuElem.querySelector('[data-role="runBtn"]');
        this.stopBtn = cpuElem.querySelector('[data-role="stopBtn"]');
        this.stepBtn = cpuElem.querySelector('[data-role="stepBtn"]');


        this.registerBank = new RegisterBank(regsConfigForArch(this.archType));

        this.display = new CpuDisplay(this);
        this.executor = ExecutorFactory.fromCPU(this);
    }

    initButtonListeners() {
        this.runBtn.addEventListener('click', () => {
            System.getInstance().runCpus();
        });
        this.stepBtn.addEventListener('click', () => {
            System.getInstance().stepCpus();
        });
        this.stopBtn.addEventListener('click', () => {
            System.getInstance().stopCpus();
        })

        initTitleButtonListener(this.cpuElem);
    }

    nextStep() {
        const lines = this.getCodeLines();
        this.executor.runStep(lines);
    }


    async executeAll() {
        const lines = this.getCodeLines();

        this.runBtn.disabled = true;
        this.stepBtn.disabled = true;
        try {
            this.display.editorHandler.lockEditor();
            await this.executor.runAll(lines);
        } catch(e) {
            console.warn('error:' + e)
        } finally {
            this.runBtn.disabled = false;
            this.stepBtn.disabled = false;
            this.display.editorHandler.unlockEditor();
        }
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
        this.dispatchEvent(new CustomEvent('reg-changed', {detail: {name,val}}));
    }

    stop() {
        this.dispatchEvent(new CustomEvent('cpu-stop', {}));
        this.executor.stop();
        this.reset();
    }

    getCpuElem() {
        return this.cpuElem;
    }
}

export default CPU;