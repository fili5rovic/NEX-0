import CPU from './simulator/cpu.js';

const cpuElem1 = document.getElementById('cpu1');
const cpu1 = new CPU(cpuElem1);

cpu1.initRunButtonListener();
