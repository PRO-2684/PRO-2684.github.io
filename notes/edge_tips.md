---
title: Edge Tips
tags: [Latest, Useful]
keywords: [Microsoft Edge, Edge, Edge Canary, Tampermonkey, Android, Script, Install, Extension, UserScript, Greasyfork, 脚本, 扩展, 用户脚本, 安卓]
description: This note provides some tips on improving your experience on using Microsoft Edge, including some flags you might want to enable/disable, modifying built-in search engines' URLs, and installing Tampermonkey scripts in Edge Canary for Android. 这篇笔记提供了一些改进 Microsoft Edge 体验的小提示，包括一些你可能想要启用/禁用的 flags，修改内置搜索引擎的网址，以及如何在 Edge Canary for Android 上安装 Tampermonkey 脚本。
---

<style>
    article details img {
        max-width: 32%;
    }
</style>

# Edge Tips

TOC:

- [Some flags you might want to enable/disable](#edge-flags)
- [Modifying built-in search engines' URLs](#search-engines)
- [Installing Tampermonkey scripts in Edge Canary for Android](#tampermonkey-scripts)

## Edge flags

🔗: `edge://flags`

- `Smooth Scrolling`: Enabled
- `Fluent scrollbars`: Enabled
- `TLS 1.3 Early Data`: Enabled
- `TLS 1.3 hybridized Kyber support`: Enabled
- `Parallel downloading`: Enabled
- `Experimental Tracking Prevention Features`: Enabled
- `Enable experimentation 'full' mode`: Enabled
- `Enable Kyber768 + NIST-P384 TLS Kyber Confidentiality`: Enabled
- `New PDF Viewer`: Disabled

## Search engines

<details><summary>English</summary>

The URLs of Edge's built-in search engines contains certain tracking parameters. Edge doesn't provide a direct way to modify them, but you can still do it by following these steps:

1. Navigate to `edge://settings/searchEngines`
2. Click the three dots on the right of the search engine you want to modify, and select "Edit"
3. You will find that the URL input box is disabled, so now press `F12` or `Ctrl+Shift+I` to open the developer tools
4. Use the element inspector to find the input box, and remove the `disabled` attribute
5. Now you can modify the URL as you wish 🎉

</details>

<details><summary>中文</summary>

Edge 内置搜索引擎的 URL 包含了一些跟踪参数。Edge 并没有提供直接修改的方法，但你仍然可以通过以下步骤来修改：

1. 打开 `edge://settings/searchEngines`
2. 点击你想要修改的搜索引擎右侧的菜单，选择“编辑”
3. 你会发现 URL 输入框是被禁用的，那么现在按下 `F12` 或 `Ctrl+Shift+I` 打开开发者工具
4. 使用元素检查器找到输入框，移除 `disabled` 属性
5. 现在你可以随意修改 URL 了 🎉

</details>

<details><summary>Screenshots/截图</summary>

Let's take Bing as an example.

![edge_search_1](@attachment/edge_search_1.jpg) ![edge_search_2](@attachment/edge_search_2.jpg) ![edge_search_3](@attachment/edge_search_3.jpg) ![edge_search_4](@attachment/edge_search_4.jpg)

</details>

## Tampermonkey scripts

<details><summary>English</summary>
1. Install the latest version of Edge Canary (125.0.2518.0 at the time of writing this note)
2. Go to Settings - About, tap the version number several times to enter developer mode
3. Go back to the settings page, head to the developer options, and select "Extension install by id"
4. Enter the id of Tampermonkey: `iikmkjmpaadaobahmlepeloendndfphd`
5. Wait for a while, and you will be prompted that the installation is successful. Now enter the extension management page from the menu
6. Click "Tampermonkey", and you will find that most of the options are not clickable. However, you can enter the management panel by clicking "Welcome to donate"
7. Open a new tab, find the script you want to install on Greasyfork, and click "Install this script" to download the js file
8. Open the js file in text mode, and copy all the code
9. Go back to the management panel you just opened, click the plus sign to create a new script, delete the default code, and paste the copied code
10. Click "File - Save", and the script is installed
11. If you wish to update your scripts, you can do that by clicking "Useful Tools - Check for userscript updates" - you don't need to do this manually. If you're tired of clicking multiple times to open the management panel, you can add a shortcut on the browser new page with URL `chrome-extension://iikmkjmpaadaobahmlepeloendndfphd/options.html#nav=settings`.
</details>

<details><summary>中文</summary>
1. 安装 Edge Canary 最新版 (此文撰写时为 125.0.2518.0)
2. 进入设置 - 关于，多点几次版本号进入开发者模式
3. 返回设置界面，进入开发人员选项，选择 "Extension install by id"
4. 输入 Tampermonkey 的 id: `iikmkjmpaadaobahmlepeloendndfphd`
5. 等待一会，会提示安装成功，然后就可以从菜单里进入扩展界面
6. 点击“篡改猴”，发现大部分选项点不动，但是可以通过点击“欢迎捐助”进入到管理面板
7. 新开一个标签页，在 Greasyfork 上找到想要安装的脚本，点击“安装此脚本”，会下载下来 js 文件
8. 文本方式打开这个 js 文件，全选复制代码
9. 回到刚刚打开的管理面板，点击加号新建脚本，删掉默认提供的代码，粘贴刚刚复制的代码
10. 点击“文件 - 保存”，脚本安装完成
11. 如果想要更新脚本，可以点击“实用工具 - 检查用户脚本更新”来更新，不需要手动操作。如果觉得点多次打开管理面板太麻烦，可以在浏览器新标签页添加一个快捷方式，URL 为 `chrome-extension://iikmkjmpaadaobahmlepeloendndfphd/options.html#nav=settings`。
</details>

<details><summary>Screenshots/截图</summary>

![edge_canary_tm_1](@attachment/edge_canary_tm_1.jpg) ![edge_canary_tm_2](@attachment/edge_canary_tm_2.jpg) ![edge_canary_tm_3](@attachment/edge_canary_tm_3.png) ![edge_canary_tm_4](@attachment/edge_canary_tm_4.jpg) ![edge_canary_tm_5](@attachment/edge_canary_tm_5.jpg)

</details>

