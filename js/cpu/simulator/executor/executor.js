import {getLabelsMap} from "../parser.js";
import {System} from "../../../system.js";

export class Executor {

    constructor(cpu) {
        this.cpu = cpu;
        this.labelMap = null;
        this.nextJump = null;
        this.currLineExecuting = null;
    }

    async execute(line, cpu) {
        throw new Error("Abstract class can't execute methods");
    }

    async run(lines) {
        this.labelMap = getLabelsMap(lines);
        this.nextJump = null;

        this.cpu.display.editorHandler.lockEditor();
        try {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                this.currLineExecuting = i;
                await this.execute(line, this.cpu);
                if (this.cpu.isHalted())
                    break;
                if (this.nextJump !== null) {
                    i = this.nextJump;
                    this.nextJump = null;
                }
            }
        } catch (e) {
            console.warn(e);
        } finally {
            this.cpu.display.editorHandler.unlockEditor();
        }

        this.cpu.dispatchEvent(new CustomEvent('instruction-all-executed', {}));
    }

    isJumpInstruction(instruction) {
        return /^(jmp|jz|jnz|jg|jge|jl|jle)$/.test(instruction);
    }

    getOperandType(operand) {
        if (operand.startsWith('#')) {
            return 'immed';
        } else if (operand.startsWith('(r') && operand.endsWith(')')) {
            return 'regind';
        } else if (operand.startsWith('r')) {
            return 'regdir';
        } else if (operand.startsWith('(') && operand.endsWith(')')) {
            return 'memind';
        } else {
            return 'memdir';
        }
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

    changePSW(cpu,newVal) {
        let pswVal = 0;
        if (newVal === 0) pswVal |= 1;
        if (newVal < 0) pswVal |= 2;
        cpu.setReg('psw', pswVal);
    }

}

