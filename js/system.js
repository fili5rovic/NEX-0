import {MemoryGenerator} from "./memory/ui/memoryGenerator.js";
import {CpuGenerator} from "./cpu/ui/cpuGenerator.js";

class SystemManager {
    constructor() {
        this.cpuGenerator = new CpuGenerator();
        this.memGenerator = new MemoryGenerator();
    }

    async runCpus() {
        this.memReset();

        const cpuPromises = []

        this.cpuGenerator.cpuMap.forEach(cpu => {
            const promise = cpu.executeAll()
            cpuPromises.push(promise)
        })

        await Promise.all(cpuPromises)

        this.cpuGenerator.cpuMap.forEach(cpu => {
            cpu.cleanup();
        });
    }

    stepCpus() {
        this.cpuGenerator.cpuMap.forEach(cpu => cpu.nextStep());
    }

    stopCpus() {
        this.cpuGenerator.cpuMap.forEach(cpu => cpu.stop());
    }

    memReset() {
        this.memGenerator.sharedMemory.reset();
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