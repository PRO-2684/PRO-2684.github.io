---
title: Agent Browser
tags: [Latest, Technical]
keywords: [agent browser, tampermonkey, user script]
description: 通过 Agent Browser 实现 AI 控制浏览器并辅助用户脚本开发。
---

# Agent Browser

## 简介

[Agent Browser](https://github.com/vercel-labs/agent-browser) 是 Vercel Labs 开发的面向 AI Agent 的浏览器自动化工具。

## 安装

### NPM

若电脑上有 `node` 和 `npm`，可以直接使用以下命令安装：

```bash
npm install -g agent-browser
```

### 手动安装 - 可执行文件 + Skill

1. 访问 [NPM Registry](https://registry.npmjs.org/agent-browser)
2. `dist-tags` 中的 `latest` 版本即为最新版本，例如 `0.26.0`
3. 搜索 `"version": "0.26.0"`，找到对应版本的 `dist` 字段
4. 下载并解压 `tarball` 字段中的压缩包
5. 将 `bin` 目录中对应系统的可执行文件放置在系统 PATH 中的任意位置
6. (可选) 将可执行文件重命名为 `agent-browser` 以便使用
7. 将 `skills` 和 `skill-data` 目录放置在可执行文件同目录下

### 手动安装 - 仅可执行文件

1. 访问 [Agent Browser GitHub Release](https://github.com/vercel-labs/agent-browser/releases) 页面
2. 下载对应操作系统的可执行文件（例如 Windows 即为 `agent-browser-win32-x64.exe`）
3. 将下载的可执行文件放置在系统 PATH 中的任意位置
4. (可选) 将可执行文件重命名为 `agent-browser` 以便使用

## 浏览器

Agent Browser 需要配合 Chromium 浏览器使用，可以是现有的浏览器，或者让它自己下载一个 Chrome。

### 自动安装 Chrome

```bash
agent-browser install
```

### 手动指定浏览器路径

打开 [配置文件](#配置)，添加或修改 `executablePath` 字段为浏览器的可执行文件路径，例如：

```json
{
  "executablePath": "C://Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
}
```

## 配置

Agent Browser 配置文件位于 `~/.agent-browser/config.json`。下面是一些常用配置项：

### `headed`

默认它会启动一个无头浏览器。为了方便调试与观察，可以将 `headed` 字段设置为 `true`：

```json
{
  "headed": true
}
```

### `autoConnect`

自动连接到现有的浏览器。默认值为 `false`，意思是会打开新的浏览器实例。如果设置为 `true`，则会自动连接打开了远程调试端口 (`chrome://inspect/#remote-debugging`) 的浏览器实例。
 
```json
{
  "autoConnect": true
}
```

亦可 [通过 `agent-browser connect` 命令或传入 `--cdp` 参数](https://github.com/vercel-labs/agent-browser#cdp-mode) 手动连接到指定端口/地址。

## 测试

假设按照上述配置：

```json
{
  "headed": true,
  "autoConnect": true,
  "executablePath": "C://Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
}
```

打开 Edge 并启用远程调试端口，测试是否能通过 `agent-browser` 控制浏览器：

```bash
agent-browser open https://www.example.com
```

(需要尽快在浏览器中允许远程调试，否则可能会连接失败，这时候再次运行上述命令即可)

## Tampermonkey 用户脚本开发

### 本地脚本

新建一个用户脚本，内容如下：

```javascript
// ==UserScript==
// @name         New Userscript Debug
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.example.com/*
// @grant        none
// @require      file:///path/to/your/script.js
// ==/UserScript==
```

在 `@require` 中指定本地脚本的路径，例如 `file:///C:/Users/YourName/Desktop/script.js`。

### AI 开发

在 `script.js` 中复制上面的文件头并删除 `@require` 一行，然后让 AI Agent 开始编写脚本。可以像这样给提示词：

```text
Please help me write a UserScript at test\test.js and test it in the browser. It should change the link at https://www.example.com/ to https://www.youtube.com/watch?v=dQw4w9WgXcQ. I've installed the script and your changes will take effect after a page refresh.
```

### 结束

```bash
agent-browser close
```

同时需要在浏览器中关闭远程调试功能，否则会有安全风险。
