import {Executor} from "../simulator/executor.js";
import {DataLoader} from "../../util/data-loader.js";

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

    getExecutor() {
        throw new Error('Abstract method must be implemented');
    }

    getKeywords() {
        throw new Error('Abstract method must be implemented');
    }

    static regConfig(name) {
        return DataLoader.get(name);
    }
}

export class OneAddrArchitecture extends Architecture {
    constructor() {
        super();
    }

    getExecutor() {
        return new Executor(this.cpu);
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