import CPU from './simulator/cpu.js';
import { extractCode, getLabelsMap } from './simulator/parser.js';
import './editor/editor.js';
import { OneAddrArchitecture } from './architecture/architecture.js';
import { EditorHandler } from './editor/editor.js';
import { CPUDisplay } from './ui/cpu-display.js';

const cpuElem = document.getElementById('gay-cpu');
const editor = cpuElem.querySelector('[data-role="editor"]');
const runBtn = document.querySelector('#runBtn');
const highlightedCode = document.querySelector('[data-role="highlighted-code"]');
const highlightedLayer = document.querySelector('[data-role="highlight-layer"]');

const cpu = new CPU(new OneAddrArchitecture());
const editorHandler = new EditorHandler(cpu, editor, highlightedCode, highlightedLayer);
const display = new CPUDisplay(cpu, editorHandler);

runBtn.addEventListener('click', async ()=>{
    let code = extractCode(editor.value);
    cpu.reset();
    display.reset();
    await cpu.runCode(code);
});