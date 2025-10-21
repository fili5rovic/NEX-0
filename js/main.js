import CPU from './simulator/cpu.js';
import { extractCode, getLabelsMap } from './simulator/parser.js';
import './editor/editor.js';
import { OneAddrArchitecture } from './architecture/architecture.js';
import { EditorHandler } from './editor/editor.js';
import { CPUDisplay } from './ui/cpu-display.js';

const editor = document.getElementById('editor');
const runBtn = document.querySelector('#runBtn');
const highlightedCode = document.getElementById('highlighted-code');
const highlightedLayer = document.getElementById('highlight-layer');

const cpu = new CPU(new OneAddrArchitecture());
const editorHandler = new EditorHandler(cpu, editor, highlightedCode, highlightedLayer);
const display = new CPUDisplay(cpu, editorHandler);




runBtn.addEventListener('click', async ()=>{
    let code = extractCode(editor.value);
    cpu.reset();
    display.reset();
    await cpu.runCode(code);
})