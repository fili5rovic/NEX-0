const editor = document.getElementById('editor');
const highlightedCode = document.getElementById('highlighted-code');

function highlight(text) {
    text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const commentRegex = /(#.*$)/gm;
    text = text.replace(commentRegex, '<span class="comment">$1</span>');
    const keywordRegex = /\b(add|sub|mul|div|load|store|neg|nop|halt|jmp|jz|jnz|jg|jge|jl|jle)\b/gi;
    text = text.replace(keywordRegex, '<span class="keyword">$1</span>');
    const registerRegex = /\b([Rr][0-9]+)\b/g;
    text = text.replace(registerRegex, '<span class="register">$1</span>');
    const numberRegex = /(#?\b\d+\b|0x[0-9A-Fa-f]+)/g;
    text = text.replace(numberRegex, '<span class="number">$1</span>');

    return text;
}

function updateHighlight() {
    const text = editor.value;
    highlightedCode.innerHTML = highlight(text) + '\n';
}

editor.addEventListener('scroll', () => {
    const highlightLayer = document.getElementById('highlight-layer');
    highlightLayer.scrollTop = editor.scrollTop;
    highlightLayer.scrollLeft = editor.scrollLeft;
});

editor.addEventListener('input', updateHighlight);

updateHighlight();