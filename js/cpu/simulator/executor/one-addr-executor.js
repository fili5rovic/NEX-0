import {removeLabelsFromLine} from "../parser.js";
import {Executor} from "./executor.js";
import {System} from "../../../system.js";

export class OneAddrExecutor extends Executor {
    constructor(cpu) {
        super(cpu);
    }


    async execute(line, cpu) {
        line = removeLabelsFromLine(line);
        line = line.toLowerCase().trim();
        if (!line) return null;
        const parts = line.split(/\s+/);
        const instruction = parts[0];
        const operand = parts[1];

        const lineNumber = this.currLineExecuting;

        if (!operand) {
            this.zeroOperandExecution(instruction, cpu);
        } else if (super.isJumpInstruction(instruction)) {
            this.jumpInstruction(instruction, operand, cpu);
        } else {
            this.oneOperandExecution(instruction, operand, cpu);
        }

        cpu.dispatchEvent(new CustomEvent('instruction-executing', {
            detail: {line, lineNumber, instruction, operand}
        }));


        await super.sleep(this.cpu.executionTime);
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
        const operandType = super.getOperandType(operand);

        switch (instruction) {
            case 'add':
                cpu.setReg('acc', accVal + super.getValFromOperand(operand, cpu));
                break;
            case 'sub':
                cpu.setReg('acc', accVal - super.getValFromOperand(operand, cpu));
                break;
            case 'mul':
                cpu.setReg('acc', accVal * super.getValFromOperand(operand, cpu));
                break;
            case 'div':
                cpu.setReg('acc', accVal / super.getValFromOperand(operand, cpu));
                break;
            case 'mod':
                cpu.setReg('acc', accVal % super.getValFromOperand(operand, cpu));
                break;
            case 'load':
                if (operandType === 'memdir' || operandType === 'memind' || operandType === 'regind') {
                    const addr = super.getAddressFromOperand(operand, cpu);
                    cpu.setReg('acc', System.getInstance().sharedMemory.get(addr));
                } else {
                    cpu.setReg('acc', super.getValFromOperand(operand, cpu));
                }
                break;
            case 'store':
                if (operandType === 'immed') {
                    console.warn('Cannot use store with immediate values. Nothing happens for now.');
                    break;
                }
                if (operandType === 'regdir') {
                    cpu.setReg(operand, accVal);
                } else {
                    const addr = super.getAddressFromOperand(operand, cpu);
                    System.getInstance().sharedMemory.set(addr, accVal);
                }
                break;
        }
    }
}