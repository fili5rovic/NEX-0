import {Memory} from "../memory.js";

export class MemoryGenerator {
    constructor() {
        this.memMap = new Map();
        this.memHtmlArr = [];
    }

    generate() {
        const mems = document.getElementsByClassName('mem')
        for (let i = 0; i < mems.length; i++) {
            if(mems[i].innerHTML !== '') {
                console.log('Not generating anything for a mem. It already has innerHTML.');
                this.memHtmlArr.push(null);
            } else {
                const html = this.#generateInnerHtmlString(mems[i]);
                this.memHtmlArr.push(html);
            }

        }

        for (let i = 0; i < mems.length; i++) {
            if(this.memHtmlArr.at(i) === null) {
                continue;
            }
            const memElem = mems[i];
            memElem.innerHTML = this.memHtmlArr[i];
            const mem = new Memory(memElem);
            this.memMap.set(i, mem);
        }
    }

    #generateInnerHtmlString(memElem) {
        const memSize = memElem.getAttribute('data-mem-size');
        const rows = memSize.split('x').at(0);
        const cols = memSize.split('x').at(1);

        const parts = [`<div class="mem-header">MEMORY ${rows * cols}B</div><table class="mem-table">`];

        for (let i = 0; i < rows; i++) {
            parts.push('\n\t<tr>');

            for (let j = 0; j < cols; j++) {
                parts.push('\n\t\t<td class="mem-cell">0</td>');
            }

            parts.push('\n\t</tr>');
        }

        parts.push('\n</table>');

        return parts.join('');
    }

    get sharedMemory() {
        // for now, it's the first mem
        return this.memMap.get(0);
    }

}