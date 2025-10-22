import CPU from './simulator/cpu.js';
import { CPUGenerator } from './ui/cpu-generator.js';

const cpuElem1 = document.getElementById('cpu1');
const cpu1 = new CPU(cpuElem1);

cpu1.initRunButtonListener();

const cpuGenerator = new CPUGenerator();
cpuGenerator.generate();
