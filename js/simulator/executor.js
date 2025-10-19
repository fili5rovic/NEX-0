import CPU from './cpu.js';

export function execute(line, cpu) {
    line = line.toLowerCase().trim();
    if (!line) return;

    const parts = line.split(' ');
    const instruction = parts[0];

    if (parts.length === 1) {
        switch (instruction) {
            case 'neg':
                cpu.setAcc(-cpu.getAcc());
                break;
            case 'nop':
                break;
            case 'halt':
                console.log('HALTED');
                break;
        }
        return;
    }

    const op = parts[1];
    let val = 0;
    let index = -1;

    if (op.includes('r')) {
        index = parseInt(op.replace('r', ''));
        val = cpu.getReg(index);
    } else {
        val = parseInt(op);
    }

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
            if (index !== -1) {
                cpu.setReg(index, cpu.getAcc());
            }
            break;
    }
}