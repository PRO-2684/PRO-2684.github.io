---
title: Minecraft 材料清单生成器
tags: [Useful]
keywords: [Minecraft, Checklist, Bill of Materials, NBT, JSON, nbtify]
description: Minecraft 材料清单生成器 - 根据给定的结构生成一份好看的材料清单; Minecraft checklist generator - Generates a nice bill of materials given a Minecraft structure.
scripts: true
---

<style>
    #json-output {
        width: 100%;
    }
    #table-output {
        margin: auto;
    }
    #image-output {
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: calc(1em * var(--scale));

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
    @font-face {
        font-family: "Minecraft";
        src: local("Minecraft"), local("Minecraft AE Pixel"), local("Monocraft"), url("../fonts/Monocraft.ttf");
    }
</style>

# Minecraft 材料清单生成器

## 📖 使用说明

> 需要 Chrome/Edge 91+ 等支持 [dynamic import `options`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#browser_compatibility) 的浏览器

1. 使用结构方块将结构保存为 `.nbt` 文件 (通常位于存档目录下 `generated/<name-space>/structures/<structure-name>.nbt`)
2. 将此文件上传至下方的输入框，等待生成结果

## 📦 上传 & 设置

- [x] 隐藏空气 (Air)

<input type="file" id="nbt-upload" accept=".nbt" disabled>

## 🧑‍💻 Raw JSON

<textarea id="json-output" rows="5" readonly></textarea>

## 📃 材料清单

结构信息

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

<div id="image-output" style="--scale: 1.5;">暂无</div>

## 🎉 致谢

- [NBTify](https://github.com/Offroaders123/NBTify) - 用于解析 NBT 文件
- [Gamer Geeks](https://www.gamergeeks.net/apps/minecraft/web-developer-tools/css-blocks-and-entities) - 用于获取 Minecraft 方块 ID 至名称的映射，以及方块图标
