(function () {
    const log = console.log.bind(console, "[Grid Generator]");
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const sizeSlider = $("#size-slider");
    const sizeInput = $("#size-input");
    const gridTitle = $("#grid-title");
    const gridContent = $("#grid-content");

    sizeSlider.addEventListener("input", sync(sizeInput));
    sizeInput.addEventListener("input", sync(sizeSlider));
    updateGrid();
    gridTitle.addEventListener("keydown", onKeyDown);
    gridContent.addEventListener("keydown", onKeyDown);

    window.addEventListener("note_loading", () => {
        gridTitle.removeEventListener("keydown", onKeyDown);
        gridContent.removeEventListener("keydown", onKeyDown);
    }, { once: true });

    /**
     * Sync the data with slider/input, and update the grid.
     * @param {HTMLElement} other The other element to sync with.
     * @returns {Function} The sync function.
     */
    function sync(other) {
        return function () {
            if (!this.reportValidity()) {
                return;
            }
            if (other.value !== this.value) { // Prevent infinite loop
                other.value = this.value;
            }
            updateGrid();
        };
    }
    /**
     * Update the table with the new rows and columns.
     */
    function updateGrid() {
        const size = parseInt(sizeInput.value);
        gridContent.style.setProperty("--size", size);
        const cnt = size * size;
        const current = gridContent.children.length;
        if (cnt >= current) {
            for (let i = current; i < cnt; i++) {
                const cell = document.createElement("div");
                cell.setAttribute("contenteditable", "plaintext-only");
                cell.textContent = `Item ${i + 1}`;
                gridContent.appendChild(cell);
            }
        } else {
            while (gridContent.children.length > cnt) {
                gridContent.removeChild(gridContent.lastElementChild);
            }
        }
    }
    /**
     * Handle the key press event to blur the element.
     * @param {KeyboardEvent} e The key press event.
     */
    function onKeyDown(e) {
        if (e.key === "Escape") {
            e.target.blur();
        }
    }
})();
