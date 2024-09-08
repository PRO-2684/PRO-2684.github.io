(function () {
    const log = console.log.bind(console, "[Grid Generator]");
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const sizeSlider = $("#size-slider");
    const sizeInput = $("#size-input");
    const bingoTitle = $("#bingo-title");
    const bingoSubtitle = $("#bingo-subtitle");
    const bingoContent = $("#bingo-content");
    const bingoReset = $("#bingo-reset");
    const bingoSave = $("#bingo-save");
    const bingoImport = $("#bingo-import");
    const bingoSaves = $("#bingo-saves");

    sizeSlider.addEventListener("input", sync(sizeInput));
    sizeInput.addEventListener("input", sync(sizeSlider));
    updateGrid();
    bingoTitle.addEventListener("keydown", handleKey);
    bingoSubtitle.addEventListener("keydown", handleKey);
    bingoContent.addEventListener("keydown", handleKey);

    bingoReset.addEventListener("click", () => {
        bingoTitle.textContent = "Title";
        bingoSubtitle.textContent = "Subtitle";
        sizeSlider.value = 3;
        sizeInput.value = 3;
        updateGrid();
        let i = 1;
        for (const cell of bingoContent.children) {
            cell.textContent = `Item ${i++}`;
        }
    });
    bingoSave.addEventListener("click", () => {
        save();
        renderSaves();
    });
    bingoImport.addEventListener("change", importSave);
    renderSaves();

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
        bingoContent.style.setProperty("--size", size);
        const cnt = size * size;
        const current = bingoContent.children.length;
        if (cnt >= current) {
            for (let i = current; i < cnt; i++) {
                const cell = document.createElement("div");
                cell.setAttribute("contenteditable", "plaintext-only");
                cell.textContent = `Item ${i + 1}`;
                bingoContent.appendChild(cell);
            }
        } else {
            while (bingoContent.children.length > cnt) {
                bingoContent.removeChild(bingoContent.lastElementChild);
            }
        }
    }
    /**
     * Handle the key event.
     * @param {KeyboardEvent} e The event.
     */
    function handleKey(e) {
        if (e.key === "Escape") {
            e.target.blur();
        } else if (e.key === "s" && e.ctrlKey) {
            e.preventDefault();
            save();
            renderSaves();
        }
    }
    /**
     * Save the current grid to the local storage.
     */
    function save() {
        const size = parseInt(sizeInput.value);
        const timestamp = new Date().getTime();
        const title = bingoTitle.textContent;
        const subtitle = bingoSubtitle.textContent;
        const contents = Array.from(bingoContent.children).map(cell => cell.textContent);
        const saves = JSON.parse(localStorage.getItem("bingo_saves") ?? "[]");
        saves.push({ size, timestamp, title, subtitle, contents });
        localStorage.setItem("bingo_saves", JSON.stringify(saves));
    }
    /**
     * Load the grid given the save object.
     * @param {Object} save The save object.
     * @param {number} save.size The size of the grid.
     * @param {number} save.timestamp The timestamp of the save.
     * @param {string} save.title The title of the grid.
     * @param {string[]} save.contents The contents of the grid.
     */
    function load(save) {
        sizeInput.value = save.size;
        sizeSlider.value = save.size;
        bingoTitle.textContent = save.title;
        bingoSubtitle.textContent = save.subtitle;
        updateGrid();
        const cells = bingoContent.children;
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = save.contents[i] ?? "<Missing data>";
        }
    }
    /**
     * Export the given save to a JSON file.
     */
    function exportSave(save) {
        const { title, timestamp } = save;
        const blob = new Blob([JSON.stringify(save)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title}_${timestamp}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    /**
     * Import the save from the file.
     */
    function importSave() {
        const file = bingoImport.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const save = JSON.parse(reader.result);
            load(save);
        };
        reader.readAsText(file);
    }
    /**
     * Render the saves to the list.
     */
    function renderSaves() {
        const saves = JSON.parse(localStorage.getItem("bingo_saves") ?? "[]");
        bingoSaves.innerHTML = "";
        for (let i = saves.length - 1; i >= 0; i--) {
            const save = saves[i];
            const saveEl = document.createElement("li");
            const saveElMain = document.createElement("a");
            const saveElDelete = document.createElement("a");
            const saveElExport = document.createElement("a");
            const { size, timestamp, title } = save;
            const time = new Date(timestamp).toLocaleString();
            saveElMain.href = "javascript:void(0)";
            saveElMain.textContent = `${title} (${size}x${size}, ${time})`;
            saveElMain.title = `Load "${title}"`;
            saveElMain.addEventListener("click", () => load(save));
            saveEl.appendChild(saveElMain);
            saveElDelete.textContent = "🗑️";
            saveElDelete.title = `Delete "${title}"`;
            saveElDelete.classList.add("bingo-saves-option");
            saveElDelete.addEventListener("click", () => {
                saves.splice(i, 1);
                localStorage.setItem("bingo_saves", JSON.stringify(saves));
                renderSaves();
            });
            saveEl.appendChild(saveElDelete);
            saveElExport.textContent = "📤";
            saveElExport.title = `Export "${title}"`;
            saveElExport.classList.add("bingo-saves-option");
            saveElExport.addEventListener("click", () => exportSave(save));
            saveEl.appendChild(saveElExport);
            bingoSaves.appendChild(saveEl);
        }
    }
})();
