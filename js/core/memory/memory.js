export class Memory {
    constructor(memElem) {
        const memSize = memElem.getAttribute('data-mem-size') || '16x16';
        const [rows, cols] = memSize.split('x').map(Number);
        if (isNaN(rows) || isNaN(cols)) {
            throw new Error(`Invalid memory size: ${memSize}`);
        }
        this.size = rows * cols;
        this.values = new Uint8Array(this.size);
        this.previousValues = new Uint8Array(this.size);

        this.boxes = Array.from(memElem.querySelectorAll('td'));

        if (this.boxes.length !== this.size) {
            throw new Error(`Table size mismatch: expected ${this.size}, got ${this.boxes.length}`);
        }

        this.updateDisplayAll(false);
    }

    updateDisplayAll(anim = true) {
        for (let i = 0; i < this.size; i++) {
            this.updateDisplaySingle(i, anim);
        }
    }

    updateDisplaySingle(index, anim = true) {
        const box = this.boxes[index];
        const currentVal = this.values[index];
        const oldVal = this.previousValues[index];

        if (anim && oldVal !== currentVal) {
            box.classList.remove('changed');
            void box.offsetWidth;
            box.classList.add('changed');
        }

        box.textContent = currentVal;
        box.classList.toggle('non-zero', currentVal !== 0);

        this.previousValues[index] = currentVal;
    }

    set(index, val) {
        if (index < 0 || index >= this.size) {
            throw new RangeError(`Memory write out of bounds: ${index} (size: ${this.size})`);
        }
        this.values[index] = val;
        this.updateDisplaySingle(index);
    }

    get(index) {
        if (index < 0 || index >= this.size) {
            throw new RangeError(`Memory read out of bounds: ${index} (size: ${this.size})`);
        }
        return this.values[index];
    }

    reset() {
        this.values.fill(0);
        this.previousValues.fill(0);
        this.updateDisplayAll(false);
    }
}