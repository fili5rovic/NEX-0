import { RegisterBank } from "../registers/register-bank.js";
import Executor from "./executor.js";

import {CPUDisplay} from "../ui/cpu-display.js"

class CPU extends EventTarget {
    constructor(architecture, cpuElem) {
        super();
        this.cpuElem = cpuElem;
        this.architecture = architecture;

        this.editor = cpuElem.querySelector('[data-role="editor"]');
        this.runBtn = cpuElem.querySelector('[data-role="runBtn"]');

        this.display = new CPUDisplay(this);
        this.executor = new Executor(this);
        this.registerBank = new RegisterBank(this.architecture.regsConfig());

        this.halted = false;
        this.executionTime = 1000;
    }

    initRunButtonListener() {
        this.runBtn.addEventListener('click', ()=> {
            this.reset();
            this.display.reset();
            this.runCode(this.editor.value);
        })
    }

    async runCode(code) {
        let lines = code.split('\n');
        await this.executor.run(lines);
    }

    reset() {
        this.registerBank.reset();
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