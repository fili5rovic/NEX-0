import CPU from './simulator/cpu.js';

import { OneAddrArchitecture } from './architecture/architecture.js';

const cpuElem = document.getElementById('gay-cpu');
const cpu = new CPU(new OneAddrArchitecture(), cpuElem);

cpu.initRunButtonListener();
