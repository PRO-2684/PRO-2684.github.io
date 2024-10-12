---
title: Bingo Generator
tags: [Test]
keywords: [grid, generator, matrix, table, bingo, 九宫格, 宫格, 表格, 生成器, 宾果]
description: Generate a bingo with custom size and content. 生成一个自定义大小和内容的宾果游戏。
scripts: true
---

<style>
    #bingo-title {
        margin: 0;
        text-align: center;
        font-weight: bold;
        font-size: larger;
    }
    #bingo-subtitle {
        margin: 0;
        text-align: center;
    }
    #bingo-content {
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
            text-align: center;
        }
    }
    #bingo-saves {
        .bingo-saves-option {
            cursor: pointer;
            margin-inline-start: 0.5em;
        }
    }
</style>

# Bingo Generator - 宾果生成器

## ⚙️ Settings

*\* Note that your content might be lost if you change the size of the grid.*

- Size: <input type="range" id="size-slider" min="1" max="8" step="1" value="3"> <input type="number" id="size-input" min="1" max="8" step="1" value="3" required>
- **Reset** current bingo: <button id="bingo-reset">↩️</button>
- **Save** current bingo: <button id="bingo-save">💾</button>
- **Import** a bingo from a `.json` file: <input type="file" id="bingo-import" accept=".json" title="Import">

Your saves:

<ul id="bingo-saves"></ul>

## 📄 Grid

*\* Use `Enter` to break lines manually. Press `Esc` to lose focus, and `Ctrl+S` to save current bingo.*

<p id="bingo-title" contenteditable="plaintext-only">Title</p>
<p id="bingo-subtitle" contenteditable="plaintext-only">Subtitle</p>
<div id="bingo-content" style="--size: 3"></div>
