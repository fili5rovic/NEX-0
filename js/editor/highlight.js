const keywords = ['add', 'sub', 'mul', 'div',
    'load', 'store',
    'neg', 'nop', 'halt',
    'jmp', 'jz', 'jnz', 'jg', 'jge', 'jl', 'jle'];

export const highlight = (text) => {
    text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const comment_regex = /(#.*$)/gm;
    const keyword_regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    const register_regex = /\b((?:R|r)[0-9]+)\b/g;
    const number_regex = /(#?\b\d+\b|0x[0-9A-Fa-f]+)/g;

    text = text.replace(comment_regex, '<span class="comment">$1</span>');
    text = text.replace(keyword_regex, '<span class="keyword">$1</span>');
    text = text.replace(register_regex, '<span class="reg">$1</span>');
    text = text.replace(number_regex, '<span class="num">$1</span>');

    return text;
};