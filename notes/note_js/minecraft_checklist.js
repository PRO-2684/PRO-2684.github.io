(async function () {
    const readNBTPromise = import("https://cdn.jsdelivr.net/npm/nbtify/+esm").then((module) => module.read);
    const blocksInfoPromise = import("../../attachments/icons-minecraft-transformed-187.json", { with: {type: "json"} });
    const log = console.log.bind(console, "[Minecraft Checklist]");
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const style = document.head.appendChild(document.createElement("link"));
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = "./attachments/icons-minecraft-187.css";

    const input = $("#nbt-upload");
    const status = $("#status");
    const checkboxes = $$("#markdown input[type=checkbox]");
    const bgColorPicker = $("#bg-color");
    const fgColorPicker = $("#fg-color");
    const scaleSlider = $("#scale-slider");
    const scaleInput = $("#scale-input");
    const resetButton = $("#reset-button");

    const jsonOutput = $("#json-output");
    const tableOutput = $("#table-output > tbody");
    const imageOutput = $("#image-output");

    window.addEventListener("note_loading", () => {
        document.head.removeChild(style);
    }, { once: true });
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", main);
    });
    bgColorPicker.addEventListener("input", function () {
        imageOutput.style.backgroundColor = this.value;
    });
    fgColorPicker.addEventListener("input", function () {
        imageOutput.style.color = this.value;
    });
    scaleSlider.addEventListener("input", sync(scaleInput));
    scaleInput.addEventListener("input", sync(scaleSlider));
    [bgColorPicker, fgColorPicker, scaleSlider, scaleInput].forEach(inputPatch);
    resetButton.addEventListener("click", reset);
    reset();
    const [readNBT, { default: itemsInfo }] = await Promise.all([readNBTPromise, blocksInfoPromise]).catch((err) => {
        status.textContent = "加载失败，请刷新重试";
        status.style.color = "red";
        status.title = err;
        log("Failed to load:", err);
        return [null, {}];
    });
    if (!readNBT || !itemsInfo) {
        return;
    }
    status.textContent = "等待上传文件";
    status.style.color = "green";
    input.disabled = false;
    input.addEventListener("input", main);

    /**
     * Patch the input element to dispatch `input` event when the value is set.
     * @param {HTMLInputElement} input The input element to patch.
     */
    function inputPatch(input) {
        const { get, set } = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        Object.defineProperty(input, "value", {
            get() {
                return get.call(this);
            },
            set(newVal) {
                const ret = set.call(this, newVal);
                this.dispatchEvent(new InputEvent("input", { bubbles: true }));
                return ret;
            }
        });
    }
    /**
     * Reset `bgColorPicker`, `fgColorPicker`, `scaleSlider` and `scaleInput`.
     */
    function reset() {
        const computedStyle = getComputedStyle(document.body);
        bgColorPicker.value = computedStyle.getPropertyValue("--background");
        fgColorPicker.value = computedStyle.getPropertyValue("--text");
        scaleSlider.value = 1.5;
        scaleInput.value = 1.5;
    }
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
            if (other.value !== this.value) { // Prevent infinite loop
                other.value = this.value;
            }
            imageOutput.style.setProperty("--scale", this.value);
        };
    }
    /**
     * Main function to handle the file input.
     */
    function main() {
        const file = input.files[0];
        const [includeAir, includeEntities, includeDrops, includeEntityItems, includeBlockItems] = Array.from(checkboxes).map((checkbox) => checkbox.checked);
        const config = { air: includeAir, entities: includeEntities, drops: includeDrops, entityItems: includeEntityItems, blockItems: includeBlockItems };
        if (file) {
            status.textContent = "处理中";
            status.style.color = "orange";
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
                status.textContent = "等待上传文件";
                status.style.color = "green";
            });
            reader.readAsArrayBuffer(file);
        } else {
            status.textContent = "未选择文件";
            status.style.color = "grey";
            log("No file selected.");
        }
    }
    /**
     * Extract the data from the NBT data.
     * @param {Object} nbt The NBT data.
     * @param {Object} config The configuration.
     * @param {boolean} config.air Include air blocks.
     * @param {boolean} config.entities Include entities.
     * @param {boolean} config.drops Include drop items.
     * @param {boolean} config.entityItems Include items from entity (inventory & armor).
     * @param {boolean} config.blockItems Include items inside block containers.
     * @returns {Object} The extracted data.
     */
    function extractFromNBT(nbt, config) {
        const mapping = nbt.data.palette.map((item) => item.Name);
        const result = {};
        function incrementResult(key, count = 1) {
            result[key] = (result[key] ?? 0) + count;
        }
        function incrementResultByItem(item) {
            if (!item || !item.id) {
                return;
            }
            const [namespace, name] = item.id.split(":");
            incrementResult(namespace === "minecraft" ? name : item.id, item.count ?? item.Count ?? 1);
        }
        for (const block of nbt.data.blocks) {
            const [namespace, name] = mapping[block.state].split(":");
            incrementResult(namespace === "minecraft" ? name : mapping[block.state]);
            if (config.blockItems) {
                const items = block.nbt?.Items ?? [];
                items.push(block.nbt?.RecordItem); // Jukebox record
                for (const item of items) {
                    incrementResultByItem(item);
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
                if (namespace === "minecraft") { // Vanilla entities
                    if (name !== "item") { // Other entities
                        incrementResult(`entity-${name}`);
                        if (config.entityItems) {
                            const items = [
                                ...entity.nbt?.Items ?? [], // Inventory items
                                ...entity.nbt?.ArmorItems ?? [], // Armor items
                                ...entity.nbt?.HandItems ?? [], // Hand-held items
                            ];
                            items.forEach(incrementResultByItem);
                        }
                    } else if (config.drops) { // `minecraft:item` entity
                        incrementResultByItem(entity.nbt.Item);
                    }
                } else { // Mod entities
                    incrementResult(entity.nbt.id);
                }
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
        nbtVersion.textContent = nbt.data.DataVersion ?? "Unknown";

    }
    /**
     * Get item info given the item id, fallback to air if not found. Will handle entity id specially.
     * @param {string} itemId The item id.
     * @returns {Object} The item info.
     */
    function getItemInfo(itemId) {
        const lookupId = itemId.startsWith("entity-") ? entityLookupName(itemId) : itemId;
        const res = itemsInfo[lookupId] ?? {
            label: lookupId ?? "Unknown",
            name: lookupId ?? "Unknown",
            css: "icon-minecraft-air",
        };
        res.name = itemId.startsWith("entity-") ? itemId.slice(7) : itemId;
        return res;
    }
    log("Loaded.");
})();