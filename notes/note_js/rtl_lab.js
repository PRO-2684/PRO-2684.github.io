(function () {
    // A class to help visualize the text with RLO and LRO characters
    class Visualizer {
        static get rlo() {
            return "\u202E";
        }
        static get lro() {
            return "\u202D";
        }
        constructor(options = {}) {
            this.mergeAdjacent = options.mergeAdjacent ?? true;
            this.text = "";
            this.cursor = 0;
            this.visualized = document.createElement("div");
        }
        setText(text) {
            this.text = text;
            this.cursor = text.length;
            this.visualize();
        }
        insert(char) {
            // ...
            this.text = this.text.slice(0, this.cursor) + char + this.text.slice(this.cursor);
            this.cursor++;
        }
        backspace() {
            // ...
            this.text = this.text.slice(0, this.cursor - 1) + this.text.slice(this.cursor);
            this.cursor--;
        }
        delete() {
            // ...
            this.text = this.text.slice(0, this.cursor) + this.text.slice(this.cursor + 1);
        }
        move(delta) {
            // ...
            this.cursor = Math.max(0, Math.min(this.text.length, this.cursor + delta));
        }
        visualize() {
            this.visualized.remove();
            this.visualized = document.createElement("div");
            let current = this.visualized;
            for (let i = 0; i < this.text.length; i++) {
                const char = this.text[i];
                const isCursor = i === this.cursor;
                const isRLO = char === Visualizer.rlo;
                const isLRO = char === Visualizer.lro;
                if (isCursor && isRLO) {
                    const span = document.createElement("span");
                    span.textContent = "⬅️";
                    span.classList.add("cursor");
                    span.classList.add("rlo");
                    const shouldMerge = this.mergeAdjacent && current.classList.contains("rlo");
                    if (shouldMerge) {
                        current.appendChild(span);
                    } else {
                        const div = document.createElement("div");
                        div.classList.add("rlo");
                        div.appendChild(span);
                        current.appendChild(div);
                        current = div;
                    }
                } else if (isCursor && isLRO) {
                    const span = document.createElement("span");
                    span.textContent = "➡️";
                    span.classList.add("cursor");
                    span.classList.add("lro");
                    const shouldMerge = this.mergeAdjacent && current.classList.contains("lro");
                    if (shouldMerge) {
                        current.appendChild(span);
                    } else {
                        const div = document.createElement("div");
                        div.classList.add("lro");
                        div.appendChild(span);
                        current.appendChild(div);
                        current = div;
                    }
                } else if (isCursor) {
                    const span = document.createElement("span");
                    span.textContent = char;
                    span.classList.add("cursor");
                    current.appendChild(span);
                } else if (isRLO) {
                    const span = document.createElement("span");
                    span.textContent = "⬅️";
                    span.classList.add("rlo");
                    const shouldMerge = this.mergeAdjacent && current.classList.contains("rlo");
                    if (shouldMerge) {
                        current.appendChild(span);
                    } else {
                        const div = document.createElement("div");
                        div.classList.add("rlo");
                        div.appendChild(span);
                        current.appendChild(div);
                        current = div;
                    }
                } else if (isLRO) {
                    const span = document.createElement("span");
                    span.textContent = "➡️";
                    span.classList.add("cursor");
                    span.classList.add("lro");
                    const shouldMerge = this.mergeAdjacent && current.classList.contains("lro");
                    if (shouldMerge) {
                        current.appendChild(span);
                    } else {
                        const div = document.createElement("div");
                        div.classList.add("lro");
                        div.appendChild(span);
                        current.appendChild(div);
                        current = div;
                    }
                } else { // Normal character
                    current.appendChild(document.createTextNode(char));
                }
            }
        }
    }
    window.Visualizer = Visualizer;
})();
