---
title: Bingo Generator
tags: [Latest, Test]
keywords: [grid, generator, matrix, table, bingo, 九宫格, 宫格, 表格, 生成器, 宾果]
description: Generate a bingo with custom size and content. 生成一个自定义大小和内容的宾果游戏。
scripts: true
---

<style>
    #grid-title {
        text-align: center;
        font-weight: bold;
        font-size: larger;
    }
    #grid-content {
        display: grid;
        grid-template-columns: repeat(var(--size), 1fr);
        padding: 0;
        gap: 0;
        width: fit-content;
        margin: auto;
        > div {
            border: 1px solid var(--border);
            margin-left: -1px;
            margin-top: -1px;
            padding: 0.5em;
            aspect-ratio: 1 / 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>

# Bingo Generator - 宾果生成器

## ⚙️ Settings

*\* Note that your content might be lost if you change the size of the grid.*

Size: <input type="range" id="size-slider" min="1" max="8" step="1" value="3"> <input type="number" id="size-input" min="1" max="8" step="1" value="3" required>

## 📄 Grid

*\* Use `Enter` to break lines manually. Press `Esc` to lose focus.*

<p id="grid-title" contenteditable="plaintext-only">Title</p>
<div id="grid-content" style="--size: 3">
</div>

## 📦 Import & Export

TODO
