import {ARITHMETIC_OPERATIONS, JUMP_CONDITIONS, UNARY_OPERATIONS} from "./executor/operations/commonOperations.js";
import {regsAddressableForArch} from "../architecture/regs/regConfigs.js";

export function extractCode(text) {
    let code = text.replace(/;.*$/gm, '');
    code = code.replace(/[ \t]+/g, ' ');
    code = code.replace(/^[ \t]+|[ \t]+$/g, '');
    return code;
}

export function getLabelsMap(lines) {
    const map = new Map();

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (/^\w+:.*$/.test(line)) {
            map.set(line.split(':')[0], i);
        }
    }

    return map;
}

export function removeLabelsFromLine(line) {
    return line.replace(/^\w+:/,'');
}

export function isValidCodeLine(line, cpu) {
    if(line.trim() === '')
        return true;

    line = line.toLowerCase();

    const labelSplit = line.split(':');
    if(labelSplit.length > 2)
        return false;
    else if(labelSplit.length === 2) {
        const labelName = labelSplit[0].slice(0, -1).trim();
        const validLabelName = /^[a-z_][a-z0-9_]*$/.test(labelName);
        if(!validLabelName)
            return false;
        line = labelSplit[1].trimStart();
        if(line === '')
            return true;
    }

    const firstSpace = line.indexOf(' ');
    let operation, operands;

    if (firstSpace === -1) {
        operation = line;
        operands = [];
    } else {
        operation = line.slice(0, firstSpace);
        const operandsStr = line.slice(firstSpace + 1).trim();
        operands = operandsStr.split(/\s*,\s*/);
    }

    if (!cpu.allowedOperations.includes(operation))
        return false;

    const addressableOperands = regsAddressableForArch('one-addr');


    const hasInvalidOperand = operands.some(op => {
        const numRegex = /(#?\b\d+\b|0x[0-9A-Fa-f]+)/;
        return !numRegex.test(op) && !addressableOperands.includes(op.toUpperCase());
    });

    if (hasInvalidOperand && !JUMP_CONDITIONS[operation]) return false;

    switch (cpu.archType) {
        case 'one-addr':
            if(!parseOneAddr(operation, operands))
                return false;
            break;
    }
    return true;
}

function parseOneAddr(operation, operands) {
    if(operation === 'store') {
        if(operands.length !== 1)
            return false;
        if(operands[0].startsWith('#'))
            return false;
    }
    if(operation === 'load' && operands.length !== 1)
        return false;

    if(operands.length === 0) {
        if(!UNARY_OPERATIONS[operation] || ARITHMETIC_OPERATIONS[operation] || JUMP_CONDITIONS[operation])
            return false;

    } else if(operands.length === 1) {
        if(UNARY_OPERATIONS[operation])
            return false;

    } else {
        return false;
    }
    return true;
}