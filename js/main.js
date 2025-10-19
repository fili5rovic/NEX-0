import CPU from '../js/simulator/cpu.js';
import {execute} from './simulator/executor.js'
import { extractCode } from './simulator/parser.js';
import { displayRegs } from './ui/display.js';
import '../js/editor/editor.js'

let cpu = new CPU();

const runBtn = document.querySelector('#runBtn');
const editor = document.querySelector('#editor');


runBtn.addEventListener('click',(e)=>{
    let code = extractCode(editor.innerText);
    let lines = code.split('\n')

    console.log(lines)

    for(const line of lines) {
        execute(line, cpu);
    }
    displayRegs(cpu)
})