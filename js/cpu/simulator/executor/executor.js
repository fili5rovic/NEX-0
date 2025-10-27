import {getLabelsMap} from "../parser.js";
import {System} from "../../../system.js";

export class Executor {

    constructor(cpu) {
        this.cpu = cpu;
        this.labelMap = null;
        this.nextJump = null;
        this.nextStep = null;
        this.isStopped = false;
    }

    execute(line, cpu, lineNumber) {
        throw new Error("Abstract class can't execute methods");
    }

    runStep(lines) {
        if(this.nextStep === null) {
            this.nextStep = 0;
            this.cpu.reset();
        }

        if (this.nextStep >= lines.length) {
            this.reset();
            this.cpu.reset();
            return;
        }

        this.labelMap = getLabelsMap(lines);

        const curr = this.nextStep ?? 0;
        const line = lines[curr];
        this.execute(line, this.cpu, curr);

        if (this.nextJump !== null) {
            this.nextStep = this.nextJump;
            this.nextJump = null;
        } else {
            this.nextStep++;
        }
    }

    async runAll(lines) {
        this.isStopped = false;
        this.nextStep = 0;
        this.cpu.reset();

        while(this.nextStep < lines.length && !this.isStopped) {
            this.runStep(lines);
            await this.sleep(this.cpu.executionTime);
        }

        this.reset();
        if (!this.isStopped) {
            this.cpu.reset();
        }
    }

    stop() {
        this.isStopped = true;
        this.reset();
    }

    reset() {
        this.nextStep = null;
        this.nextJump = null;
    }

    isJumpInstruction(instruction) {
        return /^(jmp|jz|jnz|jg|jge|jl|jle)$/.test(instruction);
    }

    OperandType = {
        IMMEDIATE: 'immed',
        REGISTER: 'regdir',
        REG_INDIRECT: 'regind',
        MEM_DIRECT: 'memdir',
        MEM_INDIRECT: 'memind'
    };

    OPERAND_PATTERNS = [
        {pattern: /^#(.+)$/, type: this.OperandType.IMMEDIATE},
        {pattern: /^\(r\d+\)$/i, type: this.OperandType.REG_INDIRECT},
        {pattern: /^r\d+$/i, type: this.OperandType.REGISTER},
        {pattern: /^\((.+)\)$/, type: this.OperandType.MEM_INDIRECT},
        {pattern: /^.+$/, type: this.OperandType.MEM_DIRECT}
    ];

    getOperandType(operand) {
        for (const {pattern, type} of this.OPERAND_PATTERNS) {
            if (pattern.test(operand)) {
                return type;
            }
        }
        throw new Error(`Invalid operand format: ${operand}`);
    }

    getAddressFromOperand(operand, cpu) {
        const type = this.getOperandType(operand);

        switch (type) {
            case 'regind':
                const regName = operand.slice(1, -1);
                return cpu.getReg(regName);

            case 'memind':
                const addr = parseInt(operand.slice(1, -1));
                return System.getInstance().sharedMemory.get(addr);

            case 'memdir':
                return parseInt(operand);

            default:
                throw new Error(`Cannot get address from operand type: ${type}`);
        }
    }

    /*
    immediate -> same number (#5 -> 5)
    regdir -> read reg (r0 -> value in r0)
    regind -> read mem at address in reg ((r0) -> mem[r0])
    memind -> read mem from number ((0x10) -> mem[0x10])
    memdir -> same number (0x10 -> 0x10)
    */
    getValFromOperand(operand, cpu) {
        const type = this.getOperandType(operand);

        switch (type) {
            case 'immed':
                return parseInt(operand.replace('#', ''));

            case 'regdir':
                return cpu.getReg(operand);

            case 'regind':
                const regName = operand.slice(1, -1);
                const address = cpu.getReg(regName);
                return System.getInstance().sharedMemory.get(address);

            case 'memind':
                const addr = operand.slice(1, -1);
                return System.getInstance().sharedMemory.get(parseInt(addr));

            case 'memdir':
                return parseInt(operand);

            default:
                throw new Error(`Unknown operand type: ${operand}`);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    changePSW(cpu, newVal) {
        let pswVal = 0;
        if (newVal === 0) pswVal |= 1;
        if (newVal < 0) pswVal |= 2;
        cpu.setReg('psw', pswVal);
    }

}

