import { RegisterBank } from "../registers/register-bank.js";
import Executor from "./executor.js";

class CPU extends EventTarget {
    constructor(architecture) {
        super();
        this.architecture = architecture;
        this.executor = new Executor(this);
        
        this.registerBank = new RegisterBank(this.architecture.regsConfig());
        
        this.halted = false;
        this.executionTime = 1000;
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
        return this.registerBank.set(name,val);
    }

    sendHalt() {
        this.halted = true;
    }

    isHalted() {
        return this.halted;
    }
}
export default CPU;