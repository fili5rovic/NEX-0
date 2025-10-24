export class RegisterBank {
    constructor(config) {
        this.regs = new Map();

        config.forEach(group => {
            group.registers.forEach(reg => {
                this.regs.set(reg.name.toLowerCase(), {
                    val: 0,
                    size: reg.size || 8,
                    readonly: reg.readonly || false,
                    broken: reg.broken || false,
                    radix: reg.radix || 10
                });
            });
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

    getDisplay(name) {
        name = name.toLowerCase();
        const reg = this.regs.get(name);
        if (reg == null || reg.broken) {
            return 0;
        }

        return reg.val.toString(reg.radix);
    }

    set(name, val) {
        name = name.toLowerCase();
        const reg = this.regs.get(name);
        if (reg == null || reg.broken || reg.readonly)
            return;
        val = this.handleOverflow(val, reg.size);
        reg.val = val;
    }

    reset() {
        for (let [name, reg] of this.regs) {
            if (!reg.readonly && !reg.broken) {
                reg.val = 0;
            }
        }
    }

    handleOverflow(number, getBitSize = 8) {
        const overflow = 2 ** getBitSize;
        console.log(overflow);
        let ret = ((number % overflow) + overflow) % overflow;
        // if (ret >= overflow / 2)
        //     ret = ret - overflow;
        return ret;
    }


}