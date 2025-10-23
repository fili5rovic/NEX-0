import { EditorHandler} from "../editor/editor-handler.js"

export class CPUDisplay {
    constructor(cpu) {
        this.cpu = cpu;
        this.editorHandler = new EditorHandler(cpu);
        this.regTable = cpu.getCpuElem().querySelector('[data-role="regs-table"]');

        this.subscribeToEvents();
    }

    subscribeToEvents() {
        this.cpu.addEventListener('instruction-executing', (e) => {
            this.highlightCurrentLine(e.detail.lineNumber);
            this.updateRegisters();
        });

        this.cpu.addEventListener('instruction-all-executed', () => {
            this.highlightCurrentLine(null);
        });

    }

    highlightCurrentLine(lineNumber) {
        this.editorHandler.setCurrentLine(lineNumber);
    }

    // ovo treba promeniti, treba da slusam za specifican registar u cpu klasi i odatle da saljem event, ovako nekako:
    // this.cpu.addEventListener('register-changed', (e) => {
    //     this.updateSingleRegister(e.detail.index, e.detail.value);
    // });
    updateRegisters(anim = true) {
        const tds = this.regTable.querySelectorAll('td');
        const ths = this.regTable.querySelectorAll('th');

        for (let i = 0; i < tds.length; i++) {
            const td = tds[i];
            const th = ths[i];
            const newVal = (i === 0 ? this.cpu.getReg('acc') : this.cpu.getReg('r' + (i-1)));
            if (anim) {
                const oldVal = parseInt(td.innerText);

                if (oldVal !== newVal) {
                    td.style.animationDuration = `${this.cpu.executionTime}ms`;
                    th.style.animationDuration = `${this.cpu.executionTime}ms`;

                    td.classList.remove('changed');
                    th.classList.remove('changed');

                    void td.offsetWidth;
                    void th.offsetWidth;

                    td.classList.add('changed');
                    th.classList.add('changed');
                }
            }
            td.innerText = newVal;
        }
    }

    reset() {
        const tds = this.regTable.querySelectorAll('td');
        const ths = this.regTable.querySelectorAll('th');

        tds.forEach(td => td.classList.remove('changed'));
        ths.forEach(th => th.classList.remove('changed'));

        this.editorHandler.clearCurrentLine();
        this.updateRegisters(false);
    }
}