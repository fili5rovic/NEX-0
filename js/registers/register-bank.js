export class RegisterBank {
    constructor(config) {
        this.regs = new Map();

        config.forEach(reg => {
            this.regs.set(reg.name.toLowerCase(), {
                val: 0,
                size: reg.size || 1,
                readonly: reg.readonly || false,
                broken: reg.broken || false
            })
        });
    }

    get(name) {
        name = name.toLowerCase();
        const reg = this.regs.get(name);
        if (reg == null || reg.broken) {
            return 0;
        }
        return reg.val ?? 0;
    }

    set(name, val) {
        name = name.toLowerCase();
        const reg = this.regs.get(name);
        if (reg == null || reg.broken || reg.readonly)
            return;
        val = handleOverflow(val, reg.size);
        reg.val = val;
    }

    handleOverflow(number, regSize = 1) {
        const overflow = 256 * regSize;
        let ret = ((number % overflow) + overflow) % overflow;
        if (ret >= overflow / 2)
            ret = ret - overflow;
        return ret;
    }
}