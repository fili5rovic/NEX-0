import {Memory} from "../memory.js";

export class MemoryGenerator {
    constructor() {
        this.memMap = new Map();
    }

    generate() {
        const mems = document.getElementsByClassName('mem')
        for (let i = 0; i < mems.length; i++) {
            const memElem = mems[i];
            memElem.innerHTML = this.#generateInnerHtmlString(memElem);
            const mem = new Memory(memElem);
            this.memMap.set(i, mem);
        }
    }

    #generateInnerHtmlString(memElem) {
        const memSize = memElem.getAttribute('data-mem-size');
        const rows = memSize.split('x').at(0);
        const cols = memSize.split('x').at(1);

        let html = `<div class="mem-header">MEM ${rows * cols}B</div><table class="mem-table">`;

        for (let i = 0; i < rows; i++) {
            html += '\n\t<tr>';

            for (let j = 0; j < cols; j++) {
                html += '\n\t\t<td class="mem-cell">0</td>';
            }

            html += '\n\t</tr>';
        }

        html += '\n</table>';

        return html;
    }

    get sharedMemory() {
        // for now, it's the first mem
        return this.memMap.get(0);
    }

}