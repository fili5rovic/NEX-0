export class CPUGenerator {
    constructor() {
        this.cpusMap = new Map();
        this.displaysMap = new Map();
    }

    generate() {
        // ovde treba malo lepse da uvezem
        let cpus = document.getElementsByClassName('cpu');
        for (let i = 0; i < cpus.length; i++) {
            const cpu = cpus[i];
            const id = 'cpu'+i;
            cpu.setAttribute('id', id);
            this.cpusMap.set(id, cpu);
        }
    }
}