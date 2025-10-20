import CPU from '../js/simulator/cpu.js';
import { extractCode, getLabelsMap } from './simulator/parser.js';
import '../js/editor/editor.js'
import {OneAddrArchitecture} from './architecture/architecture.js'
import { EditorHandler } from '../js/editor/editor.js';
let cpu = new CPU(new OneAddrArchitecture());

const runBtn = document.querySelector('#runBtn');
const editor = document.getElementById('editor');
const highlightedCode = document.getElementById('highlighted-code');
const highlightedLayer = document.getElementById('highlight-layer');

let editorHandler = new EditorHandler(cpu, editor, highlightedCode, highlightedLayer);

runBtn.addEventListener('click',()=>{
    let code = extractCode(editor.value);
    cpu.runCode(code);
})