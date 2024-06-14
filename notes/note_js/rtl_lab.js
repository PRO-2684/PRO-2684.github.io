(function () {
    // A class to help visualize the text with RLO and LRO characters
    class Visualizer {
        static get rlo() {
            return "\u202E";
        }
        static get lro() {
            return "\u202D";
        }
        static #createElement(tag, classes = [], textContent = "") {
            const element = document.createElement(tag);
            element.classList.add(...classes);
            element.textContent = textContent;
            return element;
        }
        constructor(options = {}) {
            this.mergeAdjacent = options.mergeAdjacent ?? true;
            this.visualized = options.visualized ?? Visualizer.#createElement("div", ["rtl-visualized"]);
            this.text = "";
            this.cursor = 0;
        }
        setText(text) {
            this.text = text;
            this.cursor = text.length;
            this.visualize();
        }
        insert(char) {
            this.text = this.text.slice(0, this.cursor) + char + this.text.slice(this.cursor);
            this.cursor++;
            // TODO: More efficient implementation...
            this.visualize();
        }
        backspace() {
            this.text = this.text.slice(0, this.cursor - 1) + this.text.slice(this.cursor);
            this.cursor--;
            // TODO: More efficient implementation...
            this.visualize();
        }
        delete() {
            this.text = this.text.slice(0, this.cursor) + this.text.slice(this.cursor + 1);
            // TODO: More efficient implementation...
            this.visualize();
        }
        move(delta) {
            this.cursor = Math.max(0, Math.min(this.text.length, this.cursor + delta));
            // TODO: More efficient implementation...
            this.visualize();
        }
        visualize() {
            this.visualized.innerHTML = "";
            let current = this.visualized;
            for (let i = 0; i < this.text.length; i++) {
                const char = this.text[i];
                const isCursor = i === this.cursor;
                const isRLO = char === Visualizer.rlo;
                const isLRO = char === Visualizer.lro;
                const direction = isRLO ? "rlo" : "lro";
                const arrow = isRLO ? "⬅️" : "➡️";

                if (isRLO || isLRO) {
                    current = this.#handleDirection(current, direction, arrow, isCursor);
                } else if (isCursor) {
                    const span = Visualizer.#createElement("span", ["cursor"], char);
                    current.appendChild(span);
                } else { // Normal character
                    current.appendChild(document.createTextNode(char));
                }
            }
            if (this.cursor === this.text.length) {
                const span = Visualizer.#createElement("span", ["cursor"], " ");
                current.appendChild(span);
            }
        }
        #handleDirection(current, direction, arrow, isCursor = false) {
            const span = Visualizer.#createElement("span", [direction], arrow);
            if (isCursor) {
                span.classList.add("cursor");
            }
            const shouldMerge = this.mergeAdjacent && current.classList.contains(direction);
            current.appendChild(span);
            if (!shouldMerge) {
                const div = Visualizer.#createElement("div", [direction]);
                current.appendChild(div);
                current = div;
            }
            return current;
        }
    }
    // Main logic
    const divs = $$("div.rtl-visualized");
    let focused = null;
    function onDblClick(e) {
        e.preventDefault();
        document.getSelection().removeAllRanges();
        this.toggleAttribute("data-focused");
        if (!this.hasAttribute("data-focused")) {
            focused = null;
            return;
        }
        if (focused) {
            focused.removeAttribute("data-focused");
        }
        focused = this;
    }
    for (const div of divs) {
        const text = div.textContent;
        const visualizer = new Visualizer({ visualized: div });
        visualizer.setText(text);
        div.visualizer = visualizer; // DEBUG
        if (div.hasAttribute("data-editable")) {
            const input = document.createElement("input");
            input.value = text;
            input.addEventListener("input", () => {
                visualizer.setText(input.value);
            });
            const rloBtn = document.createElement("button");
            rloBtn.textContent = "⬅️";
            rloBtn.title = "Insert RLO (or Ctrl+ArrowLeft)";
            rloBtn.addEventListener("click", () => {
                visualizer.insert(Visualizer.rlo);
                input.value = visualizer.text;
            });
            const lroBtn = document.createElement("button");
            lroBtn.textContent = "➡️";
            lroBtn.title = "Insert LRO (or Ctrl+ArrowRight)";
            lroBtn.addEventListener("click", () => {
                visualizer.insert(Visualizer.lro);
                input.value = visualizer.text;
            });
            const control = document.createElement("div");
            control.appendChild(input);
            control.appendChild(rloBtn);
            control.appendChild(lroBtn);
            control.classList.add("rtl-control");
            visualizer.control = control;
            div.after(control);
            div.addEventListener("dblclick", onDblClick);
        }
    }
    function onClick(e) {
        if (focused && !focused.contains(e.target)) {
            focused.removeAttribute("data-focused");
            focused = null;
        }
    }
    function onKeydown(e) {
        if (!focused) {
            return;
        }
        e.preventDefault();
        const visualizer = focused.visualizer;
        if (e.key === "Escape") {
            focused.removeAttribute("data-focused");
            focused = null;
        } else if (e.key === "ArrowLeft") {
            if (e.ctrlKey) {
                visualizer.insert(Visualizer.rlo);
            } else {
                visualizer.move(-1);
            }
        } else if (e.key === "ArrowRight") {
            if (e.ctrlKey) {
                visualizer.insert(Visualizer.lro);
            } else {
                visualizer.move(1);
            }
        } else if (e.key === "Backspace") {
            visualizer.backspace();
        } else if (e.key === "Delete") {
            visualizer.delete();
        } else if (e.key.length === 1) {
            visualizer.insert(e.key);
        }
        const input = visualizer.control.querySelector("input");
        input.value = visualizer.text;
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeydown);
    // Style settings
    const checkboxes = $$("input[type=checkbox]");
    const styles = $$("#markdown > style");
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        const style = styles[i + 1];
        // Wrap the checkbox with a label
        const label = document.createElement("label");
        const li = checkbox.parentNode;
        const children = [...li.childNodes];
        for (const child of children) {
            label.appendChild(child);
        }
        li.appendChild(label);
        // Enable the checkbox
        checkbox.addEventListener("change", () => {
            style.disabled = !checkbox.checked;
        });
        checkbox.disabled = false;
        style.disabled = !checkbox.checked;
    }
    // Remember to clean up
    window.addEventListener("note_loading", () => {
        document.removeEventListener("click", onClick);
        document.removeEventListener("keydown", onKeydown);
        // for (const div of divs) {
        //     const visualizer = div.visualizer;
        //     if (visualizer.control) {
        //         const control = visualizer.control;
        //         control.querySelector("input").removeEventListener("input", visualizer.setText);
        //         div.removeEventListener("dblclick", onDblClick);
        //     }
        // }
    }, { once: true });
})();
