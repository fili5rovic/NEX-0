export class EditorHandler {
    constructor(cpu) {
        const cpuElem = cpu.getCpuElem();

        this.keywords = cpu.allowedOperations;
        this.editor = cpuElem.querySelector('[data-role="editor"]');
        this.highlightedCode = cpuElem.querySelector('[data-role="highlighted-code"]');
        this.highlightLayer = cpuElem.querySelector('[data-role="highlight-layer"]');

        this.currentLineIndex = null;
        this.errors = []

        this.alwaysLocked = cpuElem.hasAttribute('data-locked');
        if(this.alwaysLocked)
            this.lockEditor();

        this.editor.addEventListener('input', this.handleInput);
        this.editor.addEventListener('keydown', this.handleKeyDown);
        this.editor.addEventListener('scroll', this.handleScroll);

        this.updateHighlight();
    }

    handleInput = () => {
        this.updateHighlight();
    }

    handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.editor.selectionStart;
            const end = this.editor.selectionEnd;
            const value = this.editor.value;
            this.editor.value = value.substring(0, start) + '\t' + value.substring(end);
            this.editor.selectionStart = this.editor.selectionEnd = start + 1;
            this.editor.dispatchEvent(new Event('input'));
        }
    }

    handleScroll = () => {
        this.highlightLayer.scrollTop = this.editor.scrollTop;
        this.highlightLayer.scrollLeft = this.editor.scrollLeft;
    }

    updateHighlight = () => {
        const text = this.editor.value;
        this.highlightedCode.innerHTML = this.highlightWithCurrentLine(text);
    }

    highlightWithCurrentLine(text) {
        const lines = text.split('\n');

        const highlightedLines = lines.map((line, index) => {
            const highlightedLine = this.highlightLine(line);

            if (index === this.currentLineIndex) {
                return `<span class="current-line">${highlightedLine}</span>`;
            }

            if(this.errors.includes(index) ) {
                return `<span class="error-line">${highlightedLine}</span>`;
            }

            return highlightedLine;
        });

        return highlightedLines.join('\n') + '\n';
    }

    highlightLine(text) {
        if (/^\s*;/.test(text)) {
            return text.replace(/(;.*$)/, '<span class="comment">$1</span>');
        }

        const keywordReg = new RegExp(`\\b(${this.keywords.join('|')})\\b`, 'gi');

        text = text.replace(/(;.*$)/gm, '<span class="comment">$1</span>');
        text = text.replace(/^(\w+):/gm, '<span class="label">$1</span>:');
        text = text.replace(keywordReg, '<span class="keyword">$1</span>');
        text = text.replace(/\b([Rr][0-9]+)\b/g, '<span class="register">$1</span>');
        text = text.replace(/(#?\b\d+\b|0x[0-9A-Fa-f]+)/g, '<span class="number">$1</span>');
        text = text.replace(/([()])/g, '<span class="brackets">$1</span>');
        text = text.replace(
            /(<span class="keyword">(?:jmp|jz|jnz|jg|jge|jl|jle)<\/span>)\s+(\w+)/gi,
            '$1 <span class="label-call">$2</span>'
        );
        return text;
    }

    clearErrors() {
        this.errors = [];
        this.updateHighlight();
    }

    setErrors(errors) {
        this.errors = errors;
        this.updateHighlight();
    }

    setCurrentLine(lineNumber) {
        this.currentLineIndex = lineNumber;
        this.updateHighlight();
        this.scrollToLine(lineNumber);
    }

    clearCurrentLine() {
        this.currentLineIndex = null;
        this.updateHighlight();
    }

    scrollToLine(lineNumber) {
        const lineHeight = parseFloat(getComputedStyle(this.editor).lineHeight);
        const scrollTop = lineNumber * lineHeight - this.editor.clientHeight / 2;
        this.editor.scrollTop = Math.max(0, scrollTop);
        this.handleScroll();
    }

    lockEditor() {

        this.editor.readOnly = true;
        this.editor.classList.add('editor-locked');
        this.highlightLayer.classList.add('editor-locked');
        this.editor.blur();
    }

    unlockEditor() {
        if(this.alwaysLocked)
            return;
        this.editor.readOnly = false;
        this.editor.classList.remove('editor-locked');
        this.highlightLayer.classList.remove('editor-locked');
    }
}

