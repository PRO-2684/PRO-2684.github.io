---
title: 🪄 Scriptio 用户脚本列表
tags: [Unlisted]
keywords: [Scriptio, UserScripts, UserScript, JavaScript, JS, Tampermonkey, QQNT, 用户脚本]
description: This page shows a collection of userscripts for Scriptio.
scripts: true
---

<style>
    #userscripts {
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
                     &::after { /* Reactive indicator */
                        font-size: 0.8em;
                        border-radius: 4px;
                        margin-left: 0.5em;
                        padding: 2px;
                        opacity: 0.8;
                    }
                    &[data-reactive="true"]::after {
                        content: "🟢";
                    }
                    &[data-reactive="false"]::after {
                        content: "🔴";
                    }
                    &[data-reactive="null"]::after {
                        content: "⚪";
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
<template id="userscript-template">
    <div class="card">
        <div class="up">
            <h3>
                <a class="name single-line" href="javascript:void(0);">用户脚本</a>
            </h3>
            <p class="description single-line" title="">说明</p>
        </div>
        <div class="down">
            <a class="author single-line" href="javascript:void(0);">作者</a>
            <div class="buttons">
                <a class="download" target="_blank" title="下载此脚本" download>下载</a>
                <a class="install" title="安装此脚本">安装</a>
            </div>
        </div>
    </div>
</template>

# 📄 Scriptio 用户脚本列表

## 📜 脚本列表

> 右上角的颜色指示器表示脚本是否支持 Scriptio 的实时响应功能。
> 脚本安装功能暂未实现，敬请期待。~~(也可能会 🕊️ 掉)~~

<div id="userscripts"></div>

## 🔗 相关链接

- [Scriptio](https://github.com/PRO-2684/Scriptio/)

<!-- - [Protocio](https://github.com/PRO-2684/protocio/) -->
