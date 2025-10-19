const keywords = ['add', 'sub', 'mul', 'div','load','store', 'neg','nop','halt'];

export const highlight = (text) => {
    text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');

    text = text.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
    text = text.replace(keywordRegex, '<span class="keyword">$1</span>');
    text = text.replace(/\b((?:R|r)[0-9]+)\b/g, '<span class="reg">$1</span>');
    text = text.replace(/(#?\b\d+\b|0x[0-9A-Fa-f]+)/g, '<span class="num">$1</span>');

    return text;
};