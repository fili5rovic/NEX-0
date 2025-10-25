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

        let newVal = 0;
        const shouldChangePSW = !(instruction === 'nop' || instruction === 'halt');
        const accVal = cpu.getReg('acc');
        switch (instruction) {
            case 'neg':
                newVal = - accVal;
                cpu.setReg('acc', newVal);
                break;
            case 'inc':
                newVal = accVal + 1;
                cpu.setReg('acc', newVal);
                break;
            case 'dec':
                newVal = accVal - 1
                cpu.setReg('acc', newVal);
                break;
            case 'nop':
                break;
            case 'halt':
                cpu.sendHalt();
                break;
            default:
                console.log('unknown zero operand instruction');
                break;
        }
        if(shouldChangePSW)
            this.changePSW(cpu,newVal);
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

        const shouldChangePSW = !(instruction === 'load' || instruction === 'store');

        let newVal = 0;
        const opVal = super.getValFromOperand(operand, cpu);

        switch (instruction) {
            case 'add':
                newVal = accVal + opVal;
                cpu.setReg('acc', newVal);
                break;
            case 'sub':
                newVal = accVal - opVal;
                cpu.setReg('acc', newVal);
                break;
            case 'mul':
                newVal = accVal * opVal;
                cpu.setReg('acc', newVal);
                break;
            case 'div':
                newVal = accVal / opVal;
                cpu.setReg('acc', newVal);
                break;
            case 'mod':
                newVal = accVal % opVal;
                cpu.setReg('acc', newVal);
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
        if (shouldChangePSW) {
            this.changePSW(cpu,newVal);
        }
    }

    changePSW(cpu,newVal) {
        let pswVal = 0;
        if (newVal === 0) pswVal |= 1;
        if (newVal < 0) pswVal |= 2;
        console.log('newVal:' + newVal);
        console.log('pswVal: ' + pswVal);
        cpu.setReg('psw', pswVal);
    }
}