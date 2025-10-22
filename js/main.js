import {CPUGenerator} from "./cpu/ui/cpu-generator.js";
import {MemoryGenerator} from "./memory/ui/memory-generator.js";

const cpuGenerator = new CPUGenerator();
cpuGenerator.generate();

const memGenerator = new MemoryGenerator();
memGenerator.generate();
