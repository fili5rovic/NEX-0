import {getLabelsMap, removeLabelsFromLine, removeComments} from "./parser.js";
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
            detail: {line, lineNumber, instruction, operand}
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
            case 'inc':
                cpu.setReg('acc', cpu.getReg('acc') + 1);
                break;
            case 'dec':
                cpu.setReg('acc', cpu.getReg('acc') - 1);
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
            case 'jmp':
                shouldJump = true;
                break;
            case 'jz':
                shouldJump = (acc === 0);
                break;
            case 'jnz':
                shouldJump = (acc !== 0);
                break;
            case 'jg':
                shouldJump = (acc > 0);
                break;
            case 'jge':
                shouldJump = (acc >= 0);
                break;
            case 'jl':
                shouldJump = (acc < 0);
                break;
            case 'jle':
                shouldJump = (acc <= 0);
                break;
            default:
                console.warn('unknown jump instruction');
                return;
        }

        if (shouldJump) {
            this.nextJump = nextIndex;
        }
    }

    oneOperandExecution(instruction, operand, cpu) {
        const accVal = cpu.getReg('acc');
        const operandType = getOperandType(operand);

        switch (instruction) {
            case 'add':
                cpu.setReg('acc', accVal + getValFromOperand(operand, cpu));
                break;
            case 'sub':
                cpu.setReg('acc', accVal - getValFromOperand(operand, cpu));
                break;
            case 'mul':
                cpu.setReg('acc', accVal * getValFromOperand(operand, cpu));
                break;
            case 'div':
                cpu.setReg('acc', accVal / getValFromOperand(operand, cpu));
                break;
            case 'mod':
                cpu.setReg('acc', accVal % getValFromOperand(operand, cpu));
                break;
            case 'load':
                if(operandType === 'memdir' || operandType === 'memind' || operandType === 'regind') {
                    const addr = getAddressFromOperand(operand, cpu);
                    cpu.setReg('acc', System.getInstance().sharedMemory.get(addr));
                } else {
                    cpu.setReg('acc', getValFromOperand(operand, cpu));
                }
                break;
            case 'store':
                if(operandType === 'immed') {
                    console.warn('Cannot use store with immediate values. Nothing happens for now.');
                    break;
                }
                if (operandType === 'regdir') {
                    cpu.setReg(operand, accVal);
                } else {
                    const addr = getAddressFromOperand(operand, cpu);
                    System.getInstance().sharedMemory.set(addr, accVal);
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

function getAddressFromOperand(operand, cpu) {
    const type = getOperandType(operand);

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
function getValFromOperand(operand, cpu) {
    const type = getOperandType(operand);

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