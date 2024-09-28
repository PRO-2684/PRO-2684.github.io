---
title: 🪄 Transitio 用户样式列表
tags: [Unlisted]
keywords: [Transitio, UserStyles, UserStyle, CSS, Style, Stylus, QQNT, 用户样式]
description: This page shows a collection of userstyles for Transitio.
scripts: true
---

<style>
    #userstyles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1em;
        div {
            padding: 0;
        }
        > .card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1em;
            border: 1px solid var(--border-dim);
            border-radius: 5px;
            background-color: var(--background);
            transition: border-color 0.25s, background-color 0.25s;
            &:hover {
                border-color: var(--link);
                background-color: var(--code-bg);
            }
            .single-line {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            > .up {
                > h3 {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 0;
                    > .name {
                        color: var(--link);
                        text-decoration: none;
                    }
                     &::after { /* Preprocessor hashtag */
                        content: "#" attr(data-preprocessor);
                        text-transform: capitalize;
                        font-size: 0.8em;
                        border-radius: 4px;
                        margin-left: 0.5em;
                        padding: 2px;
                        opacity: 0.8;
                        word-break: keep-all;
                        white-space: nowrap;
                    }
                    &[data-preprocessor="none"]::after {
                        background: #808080aa;
                    }
                    &[data-preprocessor="transitio"]::after {
                        background: #74a9f6aa;
                    }
                    &[data-preprocessor="stylus"]::after {
                        background: #6da13faa;
                    }
                }
                > .description {
                    margin-top: 0.5em;
                    font-size: 0.9em;
                    color: #6c757d;
                }
            }
            > .down {
                display: flex;
                justify-content: space-between;
                align-items: center;
                > .author {
                    color: var(--link);
                    text-decoration: none;
                    &::before {
                        content: "@";
                    }
                }
                > .buttons {
                    white-space: nowrap;
                    > .install {
                        display: none; /* Not implemented */
                    }
                    > .download, .install {
                        padding: 0.3em 0.6em;
                        border: 1px solid var(--link);
                        border-radius: 5px;
                        color: var(--link);
                        text-decoration: none;
                        text-wrap: nowrap;
                        transition: background-color 0.25s, color 0.25s;
                        &:hover {
                            background-color: var(--link);
                            color: white;
                        }
                    }
                }
            }
        }
    }
</style>
<template id="userstyle-template">
    <div class="card">
        <div class="up">
            <h3>
                <a class="name single-line" href="javascript:void(0);">用户样式</a>
            </h3>
            <p class="description single-line" title="">说明</p>
        </div>
        <div class="down">
            <a class="author single-line" href="javascript:void(0);">作者</a>
            <div class="buttons">
                <a class="download" target="_blank" title="下载此样式" download>下载</a>
                <a class="install" title="安装此样式">安装</a>
            </div>
        </div>
    </div>
</template>

# 🪄 Transitio 用户样式列表

## 📜 样式列表

> 样式安装功能暂未实现，敬请期待。~~(也可能会 🕊️ 掉)~~

<div id="userstyles"></div>

## 🔗 相关链接

- [Transitio](https://github.com/PRO-2684/transitio/)

<!-- - [Protocio](https://github.com/PRO-2684/protocio/) -->
