import {architectureTypes} from "./types/architectureTypes.js";

export class Architecture {
    constructor() {
        if (this.constructor === Architecture) {
            throw new Error('Abstract class cannot be instantiated');
        }
    }

    static fromString(archType) {
        switch (archType) {
            case 'one-addr':
                return new OneAddrArchitecture();
            default:
                console.log('defaulting to one-addr');
                return new OneAddrArchitecture();
        }
    }

    getKeywords() {
        throw new Error('Abstract method must be implemented');
    }

    static regConfig(name) {
        return architectureTypes[name];
    }
}

export class OneAddrArchitecture extends Architecture {
    constructor() {
        super();
    }

    getKeywords() {
        return [
            'add', 'sub', 'mul', 'div', 'mod',
            'load', 'store',
            'neg', 'inc', 'dec', 'nop', 'halt',
            'jmp', 'jz', 'jnz', 'jg', 'jge', 'jl', 'jle'
        ];
    }
}

export class TwoAddrArchitecture extends Architecture {
    constructor() {
        super();
    }

    getKeywords() {
        return [
            // TODO
        ];
    }
}