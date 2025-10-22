export class Architecture {
    constructor() {
        if (this.constructor === Architecture) {
            throw new Error('Abstract class cannot be instantiated');
        }
    }

    static fromString(name) {
        switch (name) {
            case 'one-addr':
                return new OneAddrArchitecture();
            default:
                return new OneAddrArchitecture();
        }
    }

    getKeywords() {
        throw new Error('Abstract method must be implemented');
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
}