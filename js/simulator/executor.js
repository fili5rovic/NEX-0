
export function execute(line, cpu) {
    line = line.toLowerCase().trim();
    if (!line) return;
    const parts = line.split(/\s+/);
    const instruction = parts[0];
    const operand = parts[1];


    if (!operand) {
        zeroOperandExecution(instruction, cpu);
        return;
    }

    const { value, regIndex } = parseOperand(operand, cpu);



    oneOperandExecution(instruction, cpu, value, regIndex);
}

function parseOperand(operand, cpu) {
    const isRegister = operand.startsWith('r');

    if (isRegister) {
        const regIndex = parseInt(operand.slice(1));
        return { value: cpu.getReg(regIndex), regIndex };
    }

    return { value: parseInt(operand), regIndex: null };
}


function zeroOperandExecution(instruction, cpu) {
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

function oneOperandExecution(instruction, cpu, val, index) {
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