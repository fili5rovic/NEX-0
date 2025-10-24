import {OneAddrExecutor} from "./one-addr-executor.js";

export class ExecutorFactory {
    static fromCPU(cpu) {
        const type = cpu.archType;
        switch (type) {
            case 'one-addr':
                return new OneAddrExecutor(cpu);
            default:
                console.log('Unknown architecture. Defaulting to one-addr');
                return new OneAddrExecutor(cpu);
        }
    }
}