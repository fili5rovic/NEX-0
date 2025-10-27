import {EditorHandler} from "../editor/editorHandler.js"

export class CpuDisplay {
    constructor(cpu) {
        this.cpu = cpu;
        this.editorHandler = new EditorHandler(cpu);
        this.regTable = cpu.getCpuElem().querySelector('[data-role="regs-table"]');

        this.regMap = this.#makeRegisterMap();

        this.subscribeToEvents();

        this.prevChanged = [];
        this.updateAllRegisters(false);
    }

    subscribeToEvents() {
        this.cpu.addEventListener('instruction-executing', (e) => {
            this.clearPreviousChanged();
            this.highlightCurrentLine(e.detail.lineNumber);
        });

        this.cpu.addEventListener('cpu-stop', () => {
            this.clearPreviousChanged();
            this.highlightCurrentLine(null);
        });

        this.cpu.addEventListener('reg-changed', (e) => {
            this.updateRegister(e.detail.name);
        });


    }

    highlightCurrentLine(lineNumber) {
        this.editorHandler.setCurrentLine(lineNumber);
    }

    clearPreviousChanged() {
        for (const elem of this.prevChanged) {
            elem.classList.remove('changed');
        }
        this.prevChanged = [];
    }

    #makeRegisterMap() {
        const tds = this.regTable.querySelectorAll('td');
        const ths = this.regTable.querySelectorAll('th');

        const map = new Map();

        for (let i = 0; i < tds.length; i++) {
            const td = tds[i];
            const th = ths[i];

            const regNameAttr = th.getAttribute('data-regName')?.toLowerCase();

            const regName = th.innerHTML.toLowerCase();
            map.set(regNameAttr || regName, {th, td});
        }
        return map;
    }

    updateRegister(name, anim = true) {
        if (!this.regMap.get(name)) {
            console.log("No register found to update");
            return;
        }
        const th = this.regMap.get(name).th;
        const td = this.regMap.get(name).td;

        const regNameAttr = th.getAttribute('data-regName');
        const newVal = this.cpu.getRegDisplay(regNameAttr || th.innerText);

        const oldVal = td.innerText;
        td.innerText = newVal;

        if (anim && oldVal !== newVal) {
            td.classList.add('changed');
            th.classList.add('changed');

            this.prevChanged.push(th);
            this.prevChanged.push(td);
        }
    }

    updateAllRegisters(anim = true) {
        for (const key of this.regMap.keys()) {
            this.updateRegister(key, anim);
        }
    }

    reset() {
        const tds = this.regTable.querySelectorAll('td');
        const ths = this.regTable.querySelectorAll('th');

        tds.forEach(td => td.classList.remove('changed'));
        ths.forEach(th => th.classList.remove('changed'));

        this.editorHandler.clearCurrentLine();
        this.updateAllRegisters(false);
    }
}