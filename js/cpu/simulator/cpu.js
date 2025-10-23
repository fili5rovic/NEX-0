import { RegisterBank } from "../registers/register-bank.js";
import Executor from "./executor.js";

import { CPUDisplay } from "../ui/cpu-display.js"
import { Architecture } from "../architecture/architecture.js";

class CPU extends EventTarget {
    constructor(cpuElem) {
        super();
        this.cpuElem = cpuElem;
        this.architecture = Architecture.fromString(cpuElem.getAttribute('data-arch'));

        this.editor = cpuElem.querySelector('[data-role="editor"]');
        this.runBtn = cpuElem.querySelector('[data-role="runBtn"]');

        this.display = new CPUDisplay(this);
        this.executor = new Executor(this);
        this.registerBank = new RegisterBank(this.architecture.regsConfig());

        this.halted = false;
        this.executionTime = 1000;
        this.running = false;
    }

    initRunButtonListener() {
        this.runBtn.addEventListener('click', () => {
            if (this.running) return; // Već radi, ignoriši

            this.startExecution();
        });
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

    setReg(name, val) {
        return this.registerBank.set(name, val);
    }

    sendHalt() {
        this.halted = true;
    }

    isHalted() {
        return this.halted;
    }

    getCpuElem() {
        return this.cpuElem;
    }
}
export default CPU;