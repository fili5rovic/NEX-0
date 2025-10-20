export class EditorHandler {
     constructor(cpu, editor, highlightedCode, highlightLayer) {
        this.cpu = cpu;
        this.editor = editor;
        this.highlightedCode = highlightedCode;
        this.highlightLayer = highlightLayer

        this.editor.addEventListener('input', this.updateHighlight);
        this.editor.addEventListener('scroll', this.handleScroll);

        this.updateHighlight();
    }

    handleScroll = () => {
        this.highlightLayer.scrollTop = this.editor.scrollTop;
        this.highlightLayer.scrollLeft = this.editor.scrollLeft;
    }

    updateHighlight = () => {
        const text = this.editor.value;
        this.highlightedCode.innerHTML = this.highlight(text) + '\n';
    }

    highlight(text) {
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

    updateHighlight() {
        const text = this.editor.value;
        this.highlightedCode.innerHTML = this.highlight(text) + '\n';
    }
}

