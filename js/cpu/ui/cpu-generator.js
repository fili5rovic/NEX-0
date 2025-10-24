import { Architecture } from "../architecture/architecture.js";
import CPU from "../simulator/cpu.js";

export class CPUGenerator {
    constructor() {
        this.cpuHtmlArr = [];
        this.cpuMap = new Map();
    }

    generate() {
        let cpus = document.getElementsByClassName('cpu');
        for (const cpuElem of cpus) {
            if (cpuElem.innerHTML !== '') {
                console.log('Not generating anything for a cpu. It already has innerHTML.');
                this.cpuHtmlArr.push(null);
            } else {
                const html = this.#makeInnerHtmlString(cpuElem);
                this.cpuHtmlArr.push(html);
            }
        }

        for (let i = 0; i < cpus.length; i++) {
            if(this.cpuHtmlArr.at(i) === null)
                continue;
            const cpuElem = cpus[i];
            cpuElem.innerHTML = this.cpuHtmlArr[i];
            const cpu = new CPU(cpuElem);
            this.cpuMap.set(i, cpu);

            cpu.initButtonListeners();
        }
    }

    #makeInnerHtmlString(cpuElem) {
        const regTableHtml = this.#makeRegTableHtmlString(cpuElem);
        const editorHtml = this.#makeEditorHtmlString();
        const controlHtml = this.#makeControlHtmlString();

        return [regTableHtml, editorHtml, controlHtml].join('');
    }

    #makeRegTableHtmlString(cpuElem) {
        const dataArch = cpuElem.getAttribute('data-arch');
        const arch = Architecture.fromString(dataArch);

        const ths = arch.regsConfig()
            .map(entry => `<th>${entry.name}</th>`)
            .join('\n\t\t\t\t');

        const n = arch.regsConfig().length;

        const tds = Array(n).fill('<td>0</td>')
            .join('\n\t\t\t\t');

        return `<table data-role="regs-table">
            <tr>
                ${ths}
            </tr>
            <tr>
                ${tds}
            </tr>
        </table>`;
    }

    #makeEditorHtmlString() {
        return `
        <div data-role="editor-container">
            <textarea data-role="editor" spellcheck="false"></textarea>
            <pre data-role="highlight-layer" aria-hidden="true"><code data-role="highlighted-code"></code></pre>
        </div>
        `;
    }

    #makeControlHtmlString() {
        return `<div class="controls">
            <input data-role="runBtn" type="button" value="RUN">
            <input data-role="stopBtn" type="button" value="STOP">
        </div>`;
    }


}