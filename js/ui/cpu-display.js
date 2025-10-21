export class CPUDisplay {
    constructor(cpu, editorHandler) {
        this.cpu = cpu;
        this.editorHandler = editorHandler;
        this.regTable = document.getElementById('regs-table');

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
    updateRegisters() {
        const tds = this.regTable.querySelectorAll('td');

        for (let i = 0; i < tds.length; i++) {
            const td = tds[i];
            const newVal = (i === 0 ? this.cpu.getAcc() : this.cpu.getReg(i - 1));
            const oldVal = parseInt(td.innerText);

            td.classList.remove('changed');

            if (oldVal !== newVal) {
                td.classList.add('changed');

                setTimeout(() => {
                    td.classList.remove('changed');
                }, 500);
            }

            td.innerText = newVal;
        }
    }

    reset() {
        this.editorHandler.clearCurrentLine();
        this.updateRegisters();
    }
}