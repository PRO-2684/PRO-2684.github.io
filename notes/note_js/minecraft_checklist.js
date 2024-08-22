(async function () {
    const readNBTPromise = import("https://cdn.jsdelivr.net/npm/nbtify/dist/index.min.js").then((module) => module.read);
    const blocksInfoPromise = import("../../attachments/icons-minecraft-transformed-187.json", { with: {type: "json"} });
    const log = console.log.bind(console, "[Minecraft Checklist]");
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const input = $("#nbt-upload");
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
    const [readNBT, { default: itemsInfo}] = await Promise.all([readNBTPromise, blocksInfoPromise]);
    input.disabled = false;
    input.addEventListener("input", main);

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
    function extractFromNBT(nbt, config) {
        const mapping = nbt.data.palette.map((item) => item.Name);
        const result = {};
        for (const block of nbt.data.blocks) {
            const [namespace, name] = mapping[block.state].split(":");
            if (namespace !== "minecraft") {
                result[mapping[block.state]] = (result[mapping[block.state]] ?? 0) + 1;
            } else {
                result[name] = (result[name] ?? 0) + 1;
            }
            if (config.items) {
                const items = block.nbt?.Items ?? [];
                for (const item of items) {
                    const [namespace, name] = item.id.split(":");
                    if (namespace !== "minecraft") {
                        result[item.id] = (result[item.id] ?? 0) + item.count ?? item.Count ?? 1;
                    } else {
                        result[name] = (result[name] ?? 0) + item.count ?? item.Count ?? 1;
                    }
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
                if (namespace !== "minecraft") {
                    result[entity.nbt.id] = (result[entity.nbt.id] ?? 0) + 1;
                } else {
                    const representName = entityRepresentName(name);
                    result[representName] = (result[representName] ?? 0) + 1;
                }
            }
        }
        return result;
    }
    function entityRepresentName(entityName) {
        const possibles = ["mob-{}-face", "{}"];
        for (const possible of possibles) {
            const representName = possible.replace("{}", entityName);
            if (itemsInfo[representName]) {
                return representName;
            }
        }
    }
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
            td_id.textContent = id;
            td_cnt.textContent = count;
            tr.append(td_icon, td_cnt, td_name, td_id);
            tableOutput.append(tr);
        }
    }
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
    function getItemInfo(itemId) {
        return itemsInfo[itemId] ?? {
            label: itemId,
            name: itemId,
            css: "icon-minecraft-air",
        };
    }
    log("Loaded.");
})();