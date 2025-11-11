import {MemoryGenerator} from "./memory/ui/memoryGenerator.js";
import {CpuGenerator} from "./cpu/ui/cpuGenerator.js";

class SystemManager {
    constructor() {
        this.cpuGenerator = new CpuGenerator();
        this.memGenerator = new MemoryGenerator();
    }

    runCpus() {
        this.cpuGenerator.cpuMap.forEach(cpu => cpu.executeAll());
    }

    stepCpus() {
        this.cpuGenerator.cpuMap.forEach(cpu => cpu.nextStep());
    }

    stopCpus() {
        this.cpuGenerator.cpuMap.forEach(cpu => cpu.stop());
    }

    generateHTML() {
        this.cpuGenerator.generate();
        this.memGenerator.generate();
    }

    get sharedMemory() {
        return this.memGenerator.sharedMemory;
    }
}

export const system = new SystemManager();