import {RegisterBank} from "../registers/register-bank.js";
import {CpuDisplay} from "../ui/cpuDisplay.js"
import {Architecture} from "../architecture/architecture.js";
import {extractCode} from "./parser.js";
import {ExecutorFactory} from "./executor/executorFactory.js";
import {getCpuTypeForAttribute} from "../types/cpuTypes.js";

class CPU extends EventTarget {
    constructor(cpuElem) {
        super();
        this.cpuElem = cpuElem;
        const cpuTypeAttr = cpuElem.getAttribute('data-cpu-type');

        const cpuType = getCpuTypeForAttribute(cpuTypeAttr);

        this.archType = cpuType.arch;
        this.architecture = Architecture.fromString(this.archType);
        this.executionTime = cpuType.executionTime;

        this.editor = cpuElem.querySelector('[data-role="editor"]');
        this.runBtn = cpuElem.querySelector('[data-role="runBtn"]');
        this.stopBtn = cpuElem.querySelector('[data-role="stopBtn"]');
        this.stepBtn = cpuElem.querySelector('[data-role="stepBtn"]');


        this.registerBank = new RegisterBank(Architecture.regConfig(this.archType));

        this.display = new CpuDisplay(this);
        this.executor = ExecutorFactory.fromCPU(this);
    }

    initButtonListeners() {
        this.runBtn.addEventListener('click', () => {
            this.executeAll();
        });
        this.stepBtn.addEventListener('click', () => {
            this.nextStep();
        });
        this.stopBtn.addEventListener('click', () => {
            this.stop();
        })
    }

    nextStep() {
        const lines = this.getCodeLines();
        this.executor.runStep(lines);
    }


    async executeAll() {
        const lines = this.getCodeLines();

        try {
            await this.executor.runAll(lines);
        } catch(e) {
            console.warn('error:' + e)
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

    sendHalt() {
        // ja ovde treba da kazem da nece vise biti instrukcija, to je todo
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