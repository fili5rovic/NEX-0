import { getLabelsMap, removeLabelsFromLine, removeComments } from "./parser.js";
import {System} from "../../system.js";

class Executor {

    constructor(cpu) {
        this.cpu = cpu;
        this.labelMap = null;
        this.nextJump = null;
        this.currLineExecuting = null;
    }

    async run(lines) {
        this.labelMap = getLabelsMap(lines);
        this.nextJump = null;

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
        this.cpu.dispatchEvent(new CustomEvent('instruction-all-executed', {}));
    }

    async execute(line, cpu) {
        line = removeLabelsFromLine(line);
        line = removeComments(line);
        line = line.toLowerCase().trim();
        if (!line) return;
        const parts = line.split(/\s+/);
        const instruction = parts[0];
        const operand = parts[1];

        const lineNumber = this.currLineExecuting;

        if (!operand) {
            this.zeroOperandExecution(instruction, cpu);
        } else if (isJumpInstruction(instruction)) {
            this.jumpInstruction(instruction, operand, cpu);
        } else {
            this.oneOperandExecution(instruction, operand, cpu);
        }

        cpu.dispatchEvent(new CustomEvent('instruction-executing', {
            detail: { line, lineNumber, instruction, operand }
        }));


        await this.sleep(this.cpu.executionTime);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    zeroOperandExecution(instruction, cpu) {
        switch (instruction) {
            case 'neg':
                cpu.setReg('acc', -cpu.getReg('acc'));
                break;
            case 'nop':
                break;
            case 'halt':
                cpu.sendHalt();
                break;
            default:
                console.log('unknown');
                break;
        }
    }

    jumpInstruction(instruction, operand, cpu) {
        let nextIndex = this.labelMap.get(operand);
        nextIndex--;
        if (isNaN(nextIndex)) {
            console.warn('label does not exist');
            return;
        }

        let acc = cpu.getReg('acc');
        let shouldJump = false;

        switch (instruction) {
            case 'jmp': shouldJump = true; break;
            case 'jz': shouldJump = (acc == 0); break;
            case 'jnz': shouldJump = (acc != 0); break;
            case 'jg': shouldJump = (acc > 0); break;
            case 'jge': shouldJump = (acc >= 0); break;
            case 'jl': shouldJump = (acc < 0); break;
            case 'jle': shouldJump = (acc <= 0); break;
            default:
                console.warn('unknown jump instruction');
                return;
        }

        if (shouldJump) {
            this.nextJump = nextIndex;
        }
    }

    oneOperandExecution(instruction, operand, cpu) {
        const val = getValFromOperand(operand, cpu);
        const accVal = cpu.getReg('acc');
        switch (instruction) {
            case 'add':
                cpu.setReg('acc', accVal + val);
                break;
            case 'sub':
                cpu.setReg('acc', accVal - val);
                break;
            case 'mul':
                cpu.setReg('acc', accVal * val);
                break;
            case 'div':
                cpu.setReg('acc', accVal / val);
                break;
            case 'load':
                if(getOperandType(operand).startsWith('mem')) {
                    const memVal = System.getInstance().sharedMemory.get(val);
                    cpu.setReg('acc', memVal);
                } else {
                    cpu.setReg('acc', val);
                }
                break;
            case 'store':
                if(getOperandType(operand).startsWith('mem')) {
                    System.getInstance().sharedMemory.set(val, cpu.getReg('acc'));
                } else {
                    cpu.setReg(operand, cpu.getReg('acc'));
                }
                break;
        }
    }
}

export default Executor;

function isJumpInstruction(instruction) {
    return /^(jmp|jz|jnz|jg|jge|jl|jle)$/.test(instruction);
}
function getOperandType(operand) {
    if(operand.startsWith('#')) {
        return 'immed';
    } else if(operand.startsWith('(r') && operand.endsWith(')')) {
        return 'regind';
    } else if(operand.startsWith('r')) {
        return 'regdir';
    } else if(operand.startsWith('(') && operand.endsWith(')')) {
        return 'memind';
    } else {
        return 'memdir';
    }
}

/*
    immediate -> same number (#5 -> 5)
    regdir -> read reg (r0 -> value in r0)
    regind -> read mem at address in reg ((r0) -> mem[r0])
    memind -> read mem from number ((0x10) -> mem[0x10])
    memdir -> same number (0x10 -> 0x10)
 */
function getValFromOperand(operand, cpu) {
    const type = getOperandType(operand);

    switch(type) {
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