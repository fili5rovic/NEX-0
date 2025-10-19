class CPU {
    constructor() {
        this.regs = [0, 0, 0, 0, 0, 0, 0, 0];
        this.acc = 0;
    }

    reset() {
        this.regs.fill(0)
        this.acc = 0;
    }

    getReg(index) {
        if(typeof index === 'string') {
            index = index.replace('r','')
            return parseInt(index);
        }
        return this.regs.at(index);
    }

    setReg(index, val) {
        if(typeof index === 'string') {
            index = index.replace('r','')
            index = parseInt(index)
        }
        this.regs[index] = val;
    }

    getAcc() { return this.acc;}
    setAcc(val) {this.acc = val;}
}

export default CPU;