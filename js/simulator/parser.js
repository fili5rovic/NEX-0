export function extractCode(text) {
    let code = removeComments(text);
    code = normalizeWhitespace(code);
    code = trimSpacesTabs(code);
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

function removeLabels(lines) {
    let ret = []
    for(line of lines) {
        line = line.replace(/^\w+:/,'');
        ret.push(line)
    }
    return ret;
}


function removeComments(code) {
    return code.replace(/;.*$/gm, '');
}

function normalizeWhitespace(code) {
    return code.replace(/[ \t]+/g, ' ');
}

function trimSpacesTabs(code) {
    return code.replace(/^[ \t]+|[ \t]+$/g, '');
}

