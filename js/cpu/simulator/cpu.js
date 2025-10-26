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

        this.editor = cpuElem.querySelector('[data-role="editor"]');
        this.runBtn = cpuElem.querySelector('[data-role="runBtn"]');
        this.stopBtn = cpuElem.querySelector('[data-role="stopBtn"]');

        this.registerBank = new RegisterBank(Architecture.regConfig(this.archType));

        this.display = new CpuDisplay(this);
        this.executor = ExecutorFactory.fromCPU(this);


        this.executionTime = cpuType.executionTime;
        this.running = false;
    }

    initButtonListeners() {
        this.runBtn.addEventListener('click', () => {
            if (this.running) return;

            this.startExecution();
        });
        this.stopBtn.addEventListener('click', () => {
            if (!this.running)
                return;
            this.sendHalt();
        })
    }

    async startExecution() {
        this.running = true;
        this.runBtn.disabled = true;

        try {
            this.reset();
            await this.runCode(this.editor.value);
        } catch (error) {
            console.error('Execution error:', error);
        } finally {
            this.running = false;
            this.runBtn.disabled = false;
        }
    }

    async runCode(code) {
        code = extractCode(code);
        let lines = code.split('\n');
        await this.executor.run(lines);
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
        return this.registerBank.set(name, val);
    }

    sendHalt() {
        this.running = false;
    }

    isHalted() {
        return !this.running;
    }

    getCpuElem() {
        return this.cpuElem;
    }
}

export default CPU;