const editor = document.getElementById('editor');
const highlightedCode = document.getElementById('highlighted-code');

function highlight(text) {
    // Escape HTML
    text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Highlight patterns
    text = text.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
    text = text.replace(/\b(add|sub|mul|div|load|store|neg|nop|halt|jmp|jz|jnz|jg|jge|jl|jle)\b/gi, '<span class="keyword">$1</span>');
    text = text.replace(/\b([Rr][0-9]+)\b/g, '<span class="register">$1</span>');
    text = text.replace(/(#?\b\d+\b|0x[0-9A-Fa-f]+)/g, '<span class="number">$1</span>');

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