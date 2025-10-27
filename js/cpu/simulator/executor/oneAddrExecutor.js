import {removeLabelsFromLine} from "../parser.js";
import {Executor} from "./executor.js";
import {System} from "../../../system.js";
import {
    ARITHMETIC_OPERATIONS,
    JUMP_CONDITIONS,
    SPECIAL_OPERATIONS,
    UNARY_OPERATIONS
} from "./operations/commonOperations.js";

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

        cpu.dispatchEvent(new CustomEvent('instruction-executing', {
            detail: {line, lineNumber, instruction, operand}
        }));

        if (!operand) {
            this.zeroOperandExecution(instruction, cpu);
        } else if (super.isJumpInstruction(instruction)) {
            this.jumpInstruction(instruction, operand, cpu);
        } else {
            this.oneOperandExecution(instruction, operand, cpu);
        }

        await super.sleep(this.cpu.executionTime);
    }


    zeroOperandExecution(instruction, cpu) {
        if (SPECIAL_OPERATIONS[instruction]) {
            SPECIAL_OPERATIONS[instruction](cpu);
            return;
        }

        let newVal = 0;
        const accVal = cpu.getReg('acc');

        if (UNARY_OPERATIONS[instruction]) {
            newVal = UNARY_OPERATIONS[instruction](accVal);
            cpu.setReg('acc', newVal);
        }

        super.changePSW(cpu, newVal);
    }

    jumpInstruction(instruction, operand, cpu) {
        let nextIndex = this.labelMap.get(operand);
        nextIndex--;
        if (isNaN(nextIndex)) {
            console.warn('label does not exist');
            return;
        }

        const psw = cpu.getReg('psw');

        if (JUMP_CONDITIONS[instruction]) {
            const shouldJump = JUMP_CONDITIONS[instruction](psw);

            if (shouldJump) {
                this.nextJump = nextIndex;
            }
        }
    }

    oneOperandExecution(instruction, operand, cpu) {
        const accVal = cpu.getReg('acc');
        const operandType = super.getOperandType(operand);

        const shouldChangePSW = !(instruction === 'load' || instruction === 'store');

        let newVal = 0;
        const opVal = super.getValFromOperand(operand, cpu);

        if (ARITHMETIC_OPERATIONS[instruction]) {
            newVal = ARITHMETIC_OPERATIONS[instruction](accVal, opVal);
            cpu.setReg('acc', newVal);
        }

        switch (instruction) {
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
            super.changePSW(cpu, newVal);
        }
    }


}