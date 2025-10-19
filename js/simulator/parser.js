export function checkSyntax(lines) {
    for (line of lines) {
        line = line.toLowerCase();
        oneArg = /^(\w+) (r\d|\d+)$/.test(line);
        zeroArg = /^(neg|push|pop|halt|nop)$/.test(line);
        if (!oneArg && !zeroArg)
            return line;
    }
    return null;
}



function removeComments(code) {
    return code.replace(/#.*$/gm, '');
}

function normalizeWhitespace(code) {
    return code.replace(/[ \t]+/g, ' ');
}

function trimSpacesTabs(code) {
    return code.replace(/^[ \t]+|[ \t]+$/g, '');
}

export function extractCode(text) {
    let code = removeComments(text);
    code = normalizeWhitespace(code);
    code = trimSpacesTabs(code);
    return code;
}