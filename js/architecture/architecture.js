class Architecture {
    constructor() {
        if (this.constructor === Architecture) {
            throw new Error('Abstract class cannot be instantiated');
        }
    }

    getKeywords() {
        throw new Error('Abstract method must be implemented');
    }

    validateInstruction(instruction) {
        throw new Error('Abstract method must be implemented');
    }

    getGeneralRegisters() {
        throw new Error('Abstract')
    }

    regsConfig() {
        throw new Error('Abstract')
    }
}

export class OneAddrArchitecture extends Architecture {
    constructor() {
        super();
        this.keywords = [
            'add', 'sub', 'mul', 'div', 'load', 'store', 'neg', 'nop', 'halt',
            'jmp', 'jz', 'jnz', 'jg', 'jge', 'jl', 'jle'
        ];
    }

    getKeywords() {
        return this.keywords;
    }

    getGeneralRegisters() {
        return Array(8).fill(0)
    }

    regsConfig() {
        return [
            { name: 'ACC' },
            { name: 'R0' },
            { name: 'R1' },
            { name: 'R2' },
            { name: 'R3' },
            { name: 'R4' },
            { name: 'R5' },
            { name: 'R6' },
            { name: 'R7' },
        ]
    }

    validateInstruction(instruction) {
        const parts = instruction.split(' ');
        const opcode = parts[0].toLowerCase();

        if (!this.keywords.includes(opcode)) {
            return { isValid: false, error: `Unknown instruction: ${opcode}` };
        }

        const operandCount = parts.length - 1;

        switch (opcode) {
            case 'nop':
            case 'halt':
                if (operandCount !== 0) {
                    return { isValid: false, error: `${opcode} takes no operands` };
                }
                break;
            case 'neg':
            case 'load':
            case 'store':
            case 'jmp':
            case 'jz':
            case 'jnz':
            case 'jg':
            case 'jge':
            case 'jl':
            case 'jle':
                if (operandCount !== 1) {
                    return { isValid: false, error: `${opcode} takes exactly 1 operand` };
                }
                break;
            case 'add':
            case 'sub':
            case 'mul':
            case 'div':
                if (operandCount !== 1) {
                    return { isValid: false, error: `${opcode} takes exactly 1 operand` };
                }
                break;
        }

        return { isValid: true };
    }
}