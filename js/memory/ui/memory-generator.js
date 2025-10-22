export class MemoryGenerator {
    constructor() {

    }

    generate() {
        const mems = document.getElementsByClassName('mem')
        for (const mem of mems) {
            const memSize = mem.getAttribute('data-mem-size');
            const row = memSize.split('x').at(0);
            const col = memSize.split('x').at(1);

            mem.innerHTML = this.#generateInnerHtmlString(row, col);
        }
    }

    #generateInnerHtmlString(rows, cols) {
        let tableHTML = '<table>';

        for (let i = 0; i < rows; i++) {
            tableHTML += '\n\t<tr>';

            for (let j = 0; j < cols; j++) {
                tableHTML += '\n\t\t<td>0</td>';
            }

            tableHTML += '\n\t</tr>';
        }

        tableHTML += '\n</table>';

        return tableHTML;
    }

}