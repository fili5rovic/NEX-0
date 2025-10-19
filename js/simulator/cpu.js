class CPU {
    constructor() {
        this.regSize = 1;

        this.regs = [0, 0, 0, 0, 0, 0, 0, 0];
        this.acc = 0;
        this.halted = false;
    }

    reset() {
        this.regs.fill(0)
        this.acc = 0;
    }

    getReg(index) {
        if (typeof index === 'string') {
            index = index.replace('r', '')
            return parseInt(index);
        }
        return this.regs.at(index);
    }

    setReg(index, val) {
        if (typeof index === 'string') {
            index = index.replace('r', '')
            index = parseInt(index)
        }
        this.regs[index] = handleOverflow(val, this.regSize);
    }

    sendHalt() {
        this.halted = true;
    }

    isHalted() {
        return this.halted;
    }

    getAcc() { return this.acc; }
    setAcc(val) { this.acc = handleOverflow(val, this.regSize); }
}
export default CPU;


function handleOverflow(number, regSize = 1) {
    const overflow = 256 * regSize;
    let ret = ((number % overflow) + overflow) % overflow;
    if (ret >= overflow / 2)
        ret = ret - overflow;
    return ret;
}
