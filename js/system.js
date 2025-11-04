import {MemoryGenerator} from "./memory/ui/memoryGenerator.js";
import {CpuGenerator} from "./cpu/ui/cpuGenerator.js";

export class System {
    static #instance = null;

    constructor(privateToken) {
        if (privateToken !== System.#PRIVATE_TOKEN) {
            throw new Error("System constructor is private! Use System.getInstance()");
        }
        this.init();
    }

    static #PRIVATE_TOKEN = Symbol("SystemPrivateToken");

    static getInstance() {
        if (!System.#instance) {
            System.#instance = new System(System.#PRIVATE_TOKEN);
        }
        return System.#instance;
    }

    init() {
        this.cpuGenerator = new CpuGenerator();
        this.memGenerator = new MemoryGenerator();
    }

    runCpus() {
        this.cpuGenerator.cpuMap.forEach(cpu => {
            cpu.executeAll()
        })
    }

    stepCpus() {
        this.cpuGenerator.cpuMap.forEach(cpu => {
            cpu.nextStep();
        })
    }

    stopCpus() {
        this.cpuGenerator.cpuMap.forEach(cpu => {
            cpu.stop();
        })
    }

    generateHTML() {
        this.cpuGenerator.generate();
        this.memGenerator.generate();
    }

    get sharedMemory() {
        return this.memGenerator.sharedMemory;
    }
}