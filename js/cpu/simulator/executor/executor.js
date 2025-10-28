import {getLabelsMap, removeLabelsFromLine} from "../parser.js";
import {System} from "../../../system.js";

export class Executor {

    constructor(cpu) {
        this.cpu = cpu;
        this.labelMap = null;
        this.nextJump = null;
        this.nextStep = 0;
        this.isStopped = false;
    }

    static HALTED = -1;

    /**
     * used to wrap execute(), parses the instruction and operands, but also deals with NOP and HALT.
     * @param line one line that should be executed
     * @param cpu cpu where line should be executed
     * @param lineNumber the number of current line being executed
     * @return {boolean} true if instruction was executed, false otherwise.
     */
    executeWrapper(line, cpu, lineNumber) {
        const parts = line.split(/\s+/);
        const instruction = parts[0];
        const operands = parts.slice(1);

        cpu.dispatchEvent(new CustomEvent('instruction-executing', {
            detail: {line, lineNumber, instruction, operands}
        }));

        if(instruction === 'nop')
            return true;

        if(instruction === 'halt') {
            this.nextStep = Executor.HALTED - 1;
            return true;
        }

        this.execute(cpu, instruction, operands);
        return true;
    }

    execute(cpu, instruction, operands) {
        throw new Error('Executor is abstract. Execute called on abstract class.');
    }

    /**
     * Executes next step in code. Skips labels and empty lines.
     * @param lines array of lines that should be executed.
     */
    runStep(lines) {
        if (this.isStopped) {
            this.isStopped = false;
            this.nextStep = 0;
            this.cpu.reset();
        }
        if (this.nextStep === Executor.HALTED || this.nextStep >= lines.length) {
            // otkomentarisi ako hoces da se loop-uje na poslednji step da ode na prvu instrukciju opet
            // this.stop();
            // this.cpu.reset();
            return;
        }

        this.labelMap = getLabelsMap(lines);

        while (this.nextStep < lines.length) {
            const curr = this.nextStep;
            let line = lines[curr];
            line = removeLabelsFromLine(line);
            line = line.toLowerCase().trim();
            if (line) {
                const executed = this.executeWrapper(line, this.cpu, curr);
                if (executed)
                    break;
            }
            this.nextStep++;
        }

        if (this.nextJump !== null) {
            this.nextStep = this.nextJump;
            this.nextJump = null;
        } else {
            this.nextStep++;
        }
    }

    /**
     * Runs all lines in 'RUN' mode, executing each line sequentially.
     * Pauses between steps for visual effect based on cpu.executionTime.
     * Stops automatically if the CPU is halted or manually stopped.
     *
     * @param {string[]} lines - Array of code lines to be executed.
     * @return {Promise<void>} Resolves when execution finishes.
     * @fires {CustomEvent} 'cpu-highlight-clear'
     */
    async runAll(lines) {
        this.isStopped = false;
        this.nextStep = 0;
        this.cpu.reset();

        while(this.nextStep < lines.length && this.nextStep !== Executor.HALTED && !this.isStopped) {
            this.runStep(lines);
            await this.sleep(this.cpu.executionTime);
        }

        this.stop();
        this.cpu.dispatchEvent(new CustomEvent('cpu-highlight-clear', {}));
    }

    stop() {
        this.isStopped = true;
        this.nextStep = 0;
        this.nextJump = null;
    }
    isJumpInstruction(instruction) {
        return /^(jmp|jz|jnz|jg|jge|jl|jle)$/.test(instruction);
    }

    OperandType = {
        IMMEDIATE: 'immed',
        REGISTER: 'regdir',
        REG_INDIRECT: 'regind',
        MEM_DIRECT: 'memdir',
        MEM_INDIRECT: 'memind'
    };

    OPERAND_PATTERNS = [
        {pattern: /^#(.+)$/, type: this.OperandType.IMMEDIATE},
        {pattern: /^\(r\d+\)$/i, type: this.OperandType.REG_INDIRECT},
        {pattern: /^r\d+$/i, type: this.OperandType.REGISTER},
        {pattern: /^\((.+)\)$/, type: this.OperandType.MEM_INDIRECT},
        {pattern: /^.+$/, type: this.OperandType.MEM_DIRECT}
    ];

    getOperandType(operand) {
        for (const {pattern, type} of this.OPERAND_PATTERNS) {
            if (pattern.test(operand)) {
                return type;
            }
        }
        throw new Error(`Invalid operand format: ${operand}`);
    }

    getAddressFromOperand(operand, cpu) {
        const type = this.getOperandType(operand);

        switch (type) {
            case 'regind':
                const regName = operand.slice(1, -1);
                return cpu.getReg(regName);

            case 'memind':
                const addr = parseInt(operand.slice(1, -1));
                return System.getInstance().sharedMemory.get(addr);

            case 'memdir':
                return parseInt(operand);

            default:
                throw new Error(`Cannot get address from operand type: ${type}`);
        }
    }

    /*
    immediate -> same number (#5 -> 5) <br>
    regdir -> read reg (r0 -> value in r0) <br>
    regind -> read mem at address in reg ((r0) -> mem[r0]) <br>
    memind -> read mem from number ((0x10) -> mem[0x10]) <br>
    memdir -> same number (0x10 -> 0x10) <br>
    */
    getValFromOperand(operand, cpu) {
        const type = this.getOperandType(operand);

        switch (type) {
            case 'immed':
                return parseInt(operand.replace('#', ''));

            case 'regdir':
                return cpu.getReg(operand);

            case 'regind':
                const regName = operand.slice(1, -1);
                const address = cpu.getReg(regName);
                return System.getInstance().sharedMemory.get(address);

            case 'memind':
                const addr = operand.slice(1, -1);
                return System.getInstance().sharedMemory.get(parseInt(addr));

            case 'memdir':
                return parseInt(operand);

            default:
                throw new Error(`Unknown operand type: ${operand}`);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    changePSW(cpu, newVal) {
        let pswVal = 0;
        if (newVal === 0) pswVal |= 1;
        if (newVal < 0) pswVal |= 2;
        cpu.setReg('psw', pswVal);
    }


}

