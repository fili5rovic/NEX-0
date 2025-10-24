import {RegisterBank} from "../registers/register-bank.js";

import {CPUDisplay} from "../ui/cpu-display.js"
import {Architecture} from "../architecture/architecture.js";
import {extractCode} from "./parser.js";
import {ExecutorFactory} from "./executor/executor-factory.js";

class CPU extends EventTarget {
    constructor(cpuElem) {
        super();
        this.cpuElem = cpuElem;
        this.archType = cpuElem.getAttribute('data-arch');
        this.architecture = Architecture.fromString(this.archType);

        this.editor = cpuElem.querySelector('[data-role="editor"]');
        this.runBtn = cpuElem.querySelector('[data-role="runBtn"]');
        this.stopBtn = cpuElem.querySelector('[data-role="stopBtn"]');

        this.display = new CPUDisplay(this);
        this.executor = ExecutorFactory.fromCPU(this);

        this.registerBank = new RegisterBank(Architecture.regConfig(this.archType));

        this.executionTime = 1000;
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
        this.runBtn.textContent = 'Running...';

        try {
            this.reset();
            await this.runCode(this.editor.value);
        } catch (error) {
            console.error('Execution error:', error);
        } finally {
            this.running = false;
            this.runBtn.disabled = false;
            this.runBtn.textContent = 'RUN';
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