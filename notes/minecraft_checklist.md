---
title: Minecraft 材料清单生成器
tags: [Useful]
keywords: [Minecraft, Checklist, Bill of Materials, NBT, JSON, nbtify]
description: Minecraft 材料清单生成器 - 根据给定的结构生成一份好看的材料清单; Minecraft checklist generator - Generates a nice bill of materials given a Minecraft structure.
scripts: true
checkboxes: true
---

<style>
    #json-output {
        width: 100%;
    }
    #table-output {
        margin: auto;
    }
    #image-output {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: calc(1em * var(--scale));
        justify-content: space-evenly;
        padding: calc(1em* var(--scale));

        > div {
            padding: 0;
            height: calc(32px * var(--scale));

            &::after {
                content: attr(data-count);
                position: relative;
                top: calc(0.8rem * var(--scale));
                font-style: normal;
                font-size: calc(0.8rem * var(--scale));
                text-align: center;
                font-family: "Minecraft", system-ui, sans-serif;
            }

            > i {
                scale: var(--scale);
            }
        }
    }
    #scale-slider, #scale-input {
        vertical-align: middle;
    }
    #status {
        font-weight: bold;
        &::after {
            content: "...";
        }
    }
    @font-face {
        font-family: "Minecraft";
        src: local("Minecraft"), local("Minecraft AE Pixel"), local("Monocraft"), url("../css/fonts/Monocraft.ttf");
    }
</style>

# Minecraft 材料清单生成器

## 📖 使用说明

> 需要 Chrome/Edge 91+ 等支持 [dynamic import `options`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#browser_compatibility) 的浏览器

1. 保存结构
    - 使用结构方块将结构保存为 `.nbt` 文件 (通常位于存档目录下 `generated/<name-space>/structures/<structure-name>.nbt`)
    - 使用机械动力的蓝图将结构保存为 `.nbt` 文件 (通常位于游戏/版本目录下 `schematics/<name>.nbt`)
2. 将此 `.nbt` 文件上传至下方的输入框，等待生成结果

## 📦 上传 & 设置

> 用 `*` 标记的选项为实验性功能，可能存在问题

<input type="file" id="nbt-upload" accept=".nbt" disabled style="float: right;">

状态: <span id="status">数据加载中</span>

- [ ] 包括空气 (`air`, `cave_air`, `void_air`)
- [ ] * 包括实体
    - [x] 包括掉落物
    - [x] 包括实体的物品 (`Items`, `ArmorItems`, `HandItems`)
- [ ] * 包括方块容器内的物品 (`Items`, `RecordItem`)

## 🧑‍💻 Raw JSON

<textarea id="json-output" rows="5" readonly></textarea>

## 📃 材料清单

<table id="table-output">
    <thead>
        <tr>
            <th>图标</th>
            <th>数量</th>
            <th>名称</th>
            <th>ID</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>

## 🖼️ 材料图

背景色: <input type="color" id="bg-color"> 前景色: <input type="color" id="fg-color"> 缩放: <input type="range" id="scale-slider" min="1" max="5" step="0.1" value="1.5"> <input type="number" id="scale-input" min="1" max="5" step="0.1" value="1.5" required> 重置: <button id="reset-button">🔄</button>

<div id="image-output" style="--scale: 1.5;">暂无</div>

## ℹ️ 其它信息

- 结构大小：<span id="structure-size">-</span>
- 结构方块数：<span id="block-count">-</span>
- 结构实体数：<span id="entity-count">-</span>
- 游戏版本：<span id="game-version">-</span>
- [数据版本 (Java)](https://minecraft.wiki/w/Data_version#Java_Edition)：<span id="nbt-version">-</span>

## 🎉 致谢

- [NBTify](https://github.com/Offroaders123/NBTify) - 用于解析 NBT 文件
- [Gamer Geeks](https://www.gamergeeks.net/apps/minecraft/web-developer-tools/css-blocks-and-entities) - 用于获取 Minecraft 方块 ID 至名称的映射，以及方块图标
