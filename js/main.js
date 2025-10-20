import CPU from '../js/simulator/cpu.js';
import { extractCode, getLabelsMap } from './simulator/parser.js';
import '../js/editor/editor.js'
import {OneAddrArchitecture} from './architecture/architecture.js'
let cpu = new CPU(new OneAddrArchitecture());

const runBtn = document.querySelector('#runBtn');
const editor = document.querySelector('#editor');

runBtn.addEventListener('click',()=>{
    let code = extractCode(editor.value);
    cpu.runCode(code);
})