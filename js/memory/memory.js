export class Memory {
    constructor(memElem) {
        this.memElem = memElem;
        const memSize = memElem.getAttribute('data-mem-size');
        this.rows = memSize.split('x').at(0);
        this.cols = memSize.split('x').at(1);
        this.size = this.rows * this.cols;
        this.values = Array(this.size).fill(1);

        this.values[5] = 9;
        this.values[1] = 5;

        this.updateDisplay();
    }

    updateDisplay() {
        const boxes = this.memElem.querySelectorAll('td');
        for (let i = 0; i < boxes.length; i++) {
            const box = boxes[i];
            box.innerHTML = this.values[i];
        }
    }

    set(index, val) {
        this.values[index] = val;
        this.updateDisplay();
    }

    get(index) {
        if(index < 0 || index > this.size)
            return -1;
        return this.values[index];
    }

}