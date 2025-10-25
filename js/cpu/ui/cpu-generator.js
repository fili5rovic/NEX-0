import {Architecture} from "../architecture/architecture.js";
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
            if (this.cpuHtmlArr.at(i) === null) continue;
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
        const regConfig = Architecture.regConfig(dataArch);

        let rows = '';

        for (const group of regConfig) {
            let ths = '';
            let tds = '';

            for (const reg of group.registers) {
                const colspan = reg.colspan || 1;
                const colspanAttr = colspan > 1 ? ` colspan="${colspan}"` : '';

                if(reg.displayName) {
                    const regNameAttr = ` data-regName="${reg.name}" `;
                    ths += `<th${colspanAttr}${regNameAttr}>${reg.displayName || reg.name}</th>\n\t\t\t\t`;
                } else {
                    ths += `<th${colspanAttr}>${reg.name}</th>\n\t\t\t\t`;
                }

                tds += `<td${colspanAttr}>0</td>\n\t\t\t\t`;
            }

            rows += `<tr>\n\t\t\t\t${ths}\n\t\t\t</tr>\n\t\t`;
            rows += `<tr>\n\t\t\t\t${tds}\n\t\t\t</tr>\n\t\t`;
        }

        return `<table data-role="regs-table">\n\t\t${rows}\n\t</table>`;
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