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