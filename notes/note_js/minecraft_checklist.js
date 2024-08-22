(async function () {
    const readNBTPromise = import("https://cdn.jsdelivr.net/npm/nbtify/dist/index.min.js").then((module) => module.read);
    const blocksInfoPromise = import("../../attachments/icons-minecraft-transformed-187.json", { with: {type: "json"} });
    const log = console.log.bind(console, "[Minecraft Checklist]");
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const input = $("#nbt-upload");
    const scaleSlider = $("#scale-slider");
    const scaleInput = $("#scale-input");
    const checkboxes = $$("#markdown input[type=checkbox]");
    const jsonOutput = $("#json-output");
    const tableOutput = $("#table-output > tbody");
    const imageOutput = $("#image-output");
    const style = document.head.appendChild(document.createElement("link"));
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = "./attachments/icons-minecraft-187.css";
    window.addEventListener("note_loading", () => {
        document.head.removeChild(style);
    }, { once: true });
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", main);
        checkbox.disabled = false;
    });
    scaleSlider.addEventListener("input", sync(scaleInput));
    scaleInput.addEventListener("input", sync(scaleSlider));
    const [readNBT, { default: itemsInfo}] = await Promise.all([readNBTPromise, blocksInfoPromise]);
    input.disabled = false;
    input.addEventListener("input", main);

    /**
     * Sync the data with slider/input, and set the scale.
     * @param {HTMLElement} other The other element to sync with.
     * @returns {Function} The sync function.
     */
    function sync(other) {
        return function () {
            if (!this.reportValidity()) {
                return;
            }
            other.value = this.value;
            imageOutput.style.setProperty("--scale", this.value);
        };
    }
    /**
     * Main function to handle the file input.
     */
    function main() {
        const file = input.files[0];
        const [includeAir, includeEntities, includeItems] = Array.from(checkboxes).map((checkbox) => checkbox.checked);
        const config = { air: includeAir, entities: includeEntities, items: includeItems };
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", async function () {
                const buffer = reader.result;
                const nbt = await readNBT(buffer);
                input.disabled = true;
                log("Raw NBT:", nbt);
                const data = extractFromNBT(nbt, config);
                log("Extracted data:", data);
                jsonOutput.value = JSON.stringify(data, null, 2);
                renderTable(data);
                renderImage(data);
                renderMeta(nbt);
                input.disabled = false;
            });
            reader.readAsArrayBuffer(file);
        } else {
            log("No file selected.");
        }
    }
    /**
     * Extract the data from the NBT data.
     * @param {Object} nbt The NBT data.
     * @param {Object} config The configuration.
     * @param {boolean} config.air Include air blocks.
     * @param {boolean} config.entities Include entities.
     * @param {boolean} config.items Include items.
     * @returns {Object} The extracted data.
     */
    function extractFromNBT(nbt, config) {
        const mapping = nbt.data.palette.map((item) => item.Name);
        const result = {};
        function incrementResult(key, count = 1) {
            result[key] = (result[key] ?? 0) + count;
        }
        for (const block of nbt.data.blocks) {
            const [namespace, name] = mapping[block.state].split(":");
            incrementResult(namespace === "minecraft" ? name : mapping[block.state]);
            if (config.items) {
                const items = block.nbt?.Items ?? [];
                for (const item of items) {
                    const [namespace, name] = item.id.split(":");
                    incrementResult(namespace === "minecraft" ? name : item.id, item.count ?? item.Count ?? 1);
                }
            }
        }
        if (!config.air) {
            delete result.air;
            delete result.cave_air;
            delete result.void_air;
        }
        if (config.entities) {
            for (const entity of nbt.data.entities) {
                const [namespace, name] = entity.nbt.id.split(":");
                incrementResult(namespace === "minecraft" ? `entity-${name}` : entity.nbt.id);
            }
        }
        return result;
    }
    /**
     * Get the lookup name of the entity (Used to lookup info).
     * @param {string} entityName The entity name.
     * @returns {string} The represent name.
     */
    function entityLookupName(entityName) {
        if (!entityName.startsWith("entity-")) {
            throw new Error("Invalid entity name.");
        } else {
            entityName = entityName.slice(7);
        }
        const possibles = ["mob-{}-face", "{}"];
        for (const possible of possibles) {
            const lookupName = possible.replace("{}", entityName);
            if (itemsInfo[lookupName]) {
                return lookupName;
            }
        }
    }
    /**
     * Render the checklist table.
     * @param {Object} data The processed data to render.
     */
    function renderTable(data) {
        tableOutput.innerHTML = "";
        for (const [id, count] of Object.entries(data)) {
            const itemInfo = getItemInfo(id);
            const tr = document.createElement("tr");
            const td_icon = document.createElement("td");
            const td_name = document.createElement("td");
            const td_id = document.createElement("td");
            const td_cnt = document.createElement("td");
            const i = td_icon.appendChild(document.createElement("i"));
            i.classList.add("icon-minecraft", itemInfo.css);
            td_name.textContent = itemInfo.label;
            td_id.textContent = itemInfo.name;
            td_cnt.textContent = count;
            tr.append(td_icon, td_cnt, td_name, td_id);
            tableOutput.append(tr);
        }
    }
    /**
     * Render the checklist image.
     * @param {Object} data The processed data to render.
     */
    function renderImage(data) {
        imageOutput.innerHTML = "";
        for (const [id, count] of Object.entries(data)) {
            const itemInfo = getItemInfo(id);
            const div = imageOutput.appendChild(document.createElement("div"));
            const i = div.appendChild(document.createElement("i"));
            div.setAttribute("data-count", count);
            i.classList.add("icon-minecraft", itemInfo.css);
            div.title = `${itemInfo.label} x${count}`;
        }
    }
    /**
     * Render metadata/other info of the NBT data.
     * @param {Object} nbt The NBT data.
     */
    function renderMeta(nbt) {
        const size = $("#structure-size");
        const blocks = $("#block-count");
        const entities = $("#entity-count");
        const gameVersion = $("#game-version");
        const nbtVersion = $("#nbt-version");
        size.textContent = nbt.data.size.join("x");
        blocks.textContent = nbt.data.blocks.length;
        entities.textContent = nbt.data.entities.length;
        if (!nbt.bedrockLevel) {
            gameVersion.textContent = "Java Edition";
        } else {
            gameVersion.textContent = "Bedrock Edition";
        }
        nbtVersion.textContent = nbt.data.DataVersion;

    }
    /**
     * Get item info given the item id, fallback to air if not found. Will handle entity id specially.
     * @param {string} itemId The item id.
     * @returns {Object} The item info.
     */
    function getItemInfo(itemId) {
        const lookupId = itemId.startsWith("entity-") ? entityLookupName(itemId) : itemId;
        const res = itemsInfo[lookupId] ?? {
            label: lookupId,
            name: lookupId,
            css: "icon-minecraft-air",
        };
        if (itemId.startsWith("entity-")) {
            res.name = itemId.slice(7);
        } else {
            res.name = itemId;
        }
        return res;
    }
    log("Loaded.");
})();