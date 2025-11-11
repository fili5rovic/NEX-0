export function extractCode(text) {
    let code = text.replace(/;.*$/gm, '');
    code = code.replace(/[ \t]+/g, ' ');
    code = code.replace(/^[ \t]+|[ \t]+$/g, '');
    return code;
}

export function getLabelsMap(lines) {
    const map = new Map();

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
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

    const labelSplit = line.split(':');
    if(labelSplit.length > 2)
        return false;
    else if(labelSplit.length === 2) {
        line = labelSplit[1];
        const labelName = labelSplit[0].slice(0, -1).trim();
        const validLabelName = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(labelName);
        if(!validLabelName)
            return false;
    }

    const parts = line.split(/\s+/);
    const operation = parts[0];
    const operands = parts.slice(1);

    if(!cpu.allowedOperations.includes(operation))
        return false;


    return true;
}