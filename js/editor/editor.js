import { highlight } from "./highlight.js";

document.addEventListener('DOMContentLoaded', () => {
    const editor = document.querySelector("#editor");
    const maxLinesInEditor = 21;

    const update = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return;
        }
        const range = selection.getRangeAt(0);

        const text = editor.innerText;
        const highlighted = highlight(text).replace(/\n/g, "<br>");

        editor.innerHTML = highlighted;

        const newRange = document.createRange();
        const lastNode = editor.lastChild;
        if (lastNode) {
            newRange.setStartAfter(lastNode);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    };

    editor.addEventListener("input", () => {
        const lines = editor.innerText.split('\n');
        if (lines.length > maxLinesInEditor) {
            editor.innerText = lines.slice(0, maxLinesInEditor).join('\n');
        }
        update();
    });

    update();
});