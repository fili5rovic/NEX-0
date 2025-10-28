import {Architecture} from "../architecture/architecture.js";
import CPU from "../simulator/cpu.js";
import {getCpuTypeForAttribute} from "../types/cpuTypes.js";

export class CpuGenerator {
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
        const cpuTypeAttr = cpuElem.getAttribute('data-cpu-type')
        const cpuType = getCpuTypeForAttribute(cpuTypeAttr);


        const titleHtml = this.#makeTitleHtmlString(cpuType);
        const regTableHtml = this.#makeRegTableHtmlString(cpuType);
        const editorHtml = this.#makeEditorHtmlString();
        const controlHtml = this.#makeControlHtmlString();

        const mainContent = [titleHtml,regTableHtml, editorHtml, controlHtml].join('');
        const mainDiv = `<div class="cpu-main-content">${mainContent}</div>`
        const sideBar = this.#makeCpuInfoBarHtmlString();

        return [mainDiv, sideBar].join('');
    }

    #makeTitleHtmlString(cpuType) {
        if(!cpuType.displayName)
            return '';
        return `<button type="button" class="cpu-title">${cpuType.displayName}</button>\n`;
    }

    #makeRegTableHtmlString(cpuType) {
        const dataArch = cpuType.arch;
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
            <input data-role="runBtn" class="cpu-button" type="button" value="RUN">
            <input data-role="stepBtn" class="cpu-button" type="button" value="STEP">
            <input data-role="stopBtn" class="cpu-button" type="button" value="STOP">
        </div>`;
    }

    #makeCpuInfoBarHtmlString() {
        return `<div class="cpu-sidebar">
                    <h3>Specs</h3>
                    <hr>
                     <h4>MEMORY</h4>
                    <table>
                        <tr>
                            <th>Instruction</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>LOAD</td>
                            <td>ACC gets value of argument</td>
                        </tr>
                        <tr>
                            <td>STORE</td>
                            <td>argument gets value of ACC</td>
                        </tr>
                    </table>
                    <hr>
                    <h4>ARITHMETIC</h4>
                    <table>
                        <tr>
                            <th>Instruction</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>ADD</td>
                            <td>adds two numbers</td>
                        </tr>
                        <tr>
                            <td>SUB</td>
                            <td>subtracts two numbers</td>
                        </tr>
                        <tr>
                            <td>INC</td>
                            <td>increments ACC by 1</td>
                        </tr>
                        <tr>
                            <td>DEC</td>
                            <td>decrements ACC by 1</td>
                        </tr>
                    </table>
                    <hr>
                    <h4>JUMPS</h4>
                    <table>
                        <tr>
                            <th>Instruction</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>JG</td>
                            <td>jump if PSW.Z == 0 and PSW.N == 0</td>
                        </tr>
                        <tr>
                            <td>JGE</td>
                            <td>jump if PSW.N == 0</td>
                        </tr>
                        <hr>
                    </table>
                    <hr>
                </div>`;
    }



}