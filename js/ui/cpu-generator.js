import { Architecture } from "../architecture/architecture.js";

export class CPUGenerator {
    constructor() {
        this.cpuHtmlArr = [];
    }

    generate() {
        let cpus = document.getElementsByClassName('cpu');
        for (const cpuElem of cpus) {
            const html = this.#makeInnerHtmlString(cpuElem);
            console.log(html);
            this.cpuHtmlArr.push(html);
        }
    }


    #makeInnerHtmlString(cpuElem) {
        const regTableHtml = this.#makeRegTableHtmlString(cpuElem);
        const editorHtml = this.#makeEditorHtmlString();
        const controlHtml = this.#makeControlHtmlString();

        return [regTableHtml, editorHtml, controlHtml].join('');
    }

    #makeRegTableHtmlString(cpuElem) {
        const arch = Architecture.fromString(cpuElem.getAttribute('data-arch'));

        return `<table data-role="regs-table">
            <tr>
                <th>ACC</th>
                <th>R0</th>
                <th>R1</th>
                <th>R2</th>
                <th>R3</th>
                <th>R4</th>
                <th>R5</th>
                <th>R6</th>
                <th>R7</th>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
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
            <input class="button" data-role="runBtn" type="button" value="RUN">
        </div>`;
    }


}