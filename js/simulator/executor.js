import { displayRegs } from "../ui/display.js";
import { getLabelsMap } from "./parser.js";

class Executor {

    constructor(cpu) {
        this.cpu = cpu;
        this.labelMap = null;
        this.nextJump = null;
    }

    run(lines) {
        this.labelMap = getLabelsMap(lines);
        this.nextJump = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            this.execute(line, this.cpu);
            if (this.cpu.isHalted())
                break;
            if (this.nextJump !== null) {
                i = this.nextJump;
                this.nextJump = null;
            }

        }
        displayRegs(this.cpu);
    }

    execute(line, cpu) {
        line = line.toLowerCase().trim();
        if (!line) return;
        const parts = line.split(/\s+/);
        const instruction = parts[0];
        const operand = parts[1];


        if (!operand) {
            this.zeroOperandExecution(instruction, cpu);
            return;
        }

        if (isJumpInstruction(instruction)) {
            this.jumpInstruction(instruction, operand, cpu);
            return;
        }

        const { value, regIndex } = parseOperand(operand, cpu);


        this.oneOperandExecution(instruction, cpu, value, regIndex);
    }

    zeroOperandExecution(instruction, cpu) {
        switch (instruction) {
            case 'neg':
                cpu.setAcc(-cpu.getAcc());
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
        if (!nextIndex) {
            console.warn('label does not exist');
            return;
        }

        let acc = cpu.getAcc();

        switch (instruction) {
            case 'jmp':
                this.nextJump = nextIndex;
                break;
            case 'jz':
                if (acc == 0)
                    this.nextJump = nextIndex;
                break;
            case 'jnz':
                if (acc != 0)
                    this.nextJump = nextIndex;
                break;
            case 'jg':
                if (acc > 0)
                    this.nextJump = nextIndex;
                break;
            case 'jge':
                if (acc >= 0)
                    this.nextJump = nextIndex;
                break;
            case 'jl':
                if (acc < 0)
                    this.nextJump = nextIndex;
                break;
            case 'jle':
                if (acc <= 0)
                    this.nextJump = nextIndex;
                break;
            default:
                console.warn('unknown jump instruction')
                break;
        }
    }

    oneOperandExecution(instruction, cpu, val, index) {
        switch (instruction) {
            case 'add':
                cpu.setAcc(cpu.getAcc() + val);
                break;
            case 'sub':
                cpu.setAcc(cpu.getAcc() - val);
                break;
            case 'mul':
                cpu.setAcc(cpu.getAcc() * val);
                break;
            case 'div':
                cpu.setAcc(cpu.getAcc() / val);
                break;
            case 'load':
                cpu.setAcc(val);
                break;
            case 'store':
                if (index !== null) {
                    cpu.setReg(index, cpu.getAcc());
                }
                break;
        }
    }
}

export default Executor;

function isJumpInstruction(instruction) {
    return /^(jmp|jz|jnz|jg|jge|jl|jle)$/.test(instruction);
}

function parseOperand(operand, cpu) {
    const isRegister = operand.startsWith('r');

    if (isRegister) {
        const regIndex = parseInt(operand.slice(1));
        return { value: cpu.getReg(regIndex), regIndex };
    }

    return { value: parseInt(operand), regIndex: null };
}