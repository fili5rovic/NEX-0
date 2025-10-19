import CPU from '../js/simulator/cpu.js';
import Executor from './simulator/executor.js'
import { extractCode, getLabelsMap } from './simulator/parser.js';
import '../js/editor/editor.js'

let cpu = new CPU();

let executor = new Executor(cpu);

const runBtn = document.querySelector('#runBtn');
const editor = document.querySelector('#editor');



runBtn.addEventListener('click',(e)=>{
    let code = extractCode(editor.innerText);
    let lines = code.split('\n')

    executor.run(lines);
})