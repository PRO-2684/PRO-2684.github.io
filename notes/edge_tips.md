---
title: Edge Tips
tags: [Latest, Useful]
keywords: [Microsoft Edge, Edge, Edge Canary, Tampermonkey, Android, Script, Install, Extension, UserScript, Greasyfork, 脚本, 扩展, 用户脚本, 安卓]
description: This note provides some tips on improving your experience on using Microsoft Edge, including some flags you might want to enable/disable, modifying built-in search engines' URLs, disabling "Rewrite with Copilot", and installing Tampermonkey scripts in Edge Canary for Android. 这篇笔记提供了一些改进 Microsoft Edge 体验的小提示，包括一些你可能想要启用/禁用的 flags，修改内置搜索引擎的网址，禁用“使用 Copilot 重写”，以及如何在 Edge Canary for Android 上安装 Tampermonkey 脚本。
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
- [Disabling "Rewrite with Copilot"](#rewrite-with-copilot)
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

## Rewrite with Copilot

[Reference](https://answers.microsoft.com/en-us/microsoftedge/forum/all/how-do-i-disable-rewrite-with-copilot-in-edge/68152c06-2600-49c2-9a52-341f7f84b18a)

<details><summary>English</summary>

If you don't like the "Rewrite with Copilot" feature in Edge, you can disable it by following these steps:

1. Navigate to `edge://settings/languages`
2. Under "Writing assistance", disable "Use Compose (AI-writing) on the web"

M\$ doesn't include the word "Copilot" in the setting, making it hard to find. I think [Siegfried Beitl](https://answers.microsoft.com/en-us/profile/85ca1879-35d8-4e16-9709-9e80718f5f36) had a point:

![edge_copilot_comment](@attachment/edge_copilot_comment.jpg)

</details>

<details><summary>中文</summary>

如果你不喜欢 Edge 中的“使用 Copilot 重写”功能，你可以通过以下步骤来禁用它：

1. 打开 `edge://settings/languages`
2. 在“写作帮助”下，禁用“在 Web上使用撰写(AI 书写)”

微软在设置中没有包含“Copilot”这个词，使得这个设置项很难找。我认为 [Siegfried Beitl](https://answers.microsoft.com/en-us/profile/85ca1879-35d8-4e16-9709-9e80718f5f36) 说得很对：

![edge_copilot_comment](@attachment/edge_copilot_comment.jpg)

</details>

## Tampermonkey scripts

<details><summary>English</summary>
1. Install the latest version of Edge Canary (128.0.2635.0 at the time of writing this note)
2. Go to Settings - About, tap the version number several times to enter developer mode
3. Go back to the settings page, head to the developer options, and select "Extension install by id"
4. Enter the id of Tampermonkey: `iikmkjmpaadaobahmlepeloendndfphd`
5. Wait for a while, and you will be prompted that the installation is successful. Now enter the extension management page from the menu
6. Click "Tampermonkey" - "Dashboard" to enter the dashboard
7. Open a new tab, find the script you want to install on Greasyfork, and click "Install this script" to install/update the script
8. If you're tired of clicking multiple times to open the dashboard, you can add a shortcut on the browser new page with URL `chrome-extension://iikmkjmpaadaobahmlepeloendndfphd/options.html#nav=settings`.
</details>

<details><summary>中文</summary>
1. 安装 Edge Canary 最新版 (此文撰写时为 128.0.2635.0)
2. 进入设置 - 关于，多点几次版本号进入开发者模式
3. 返回设置界面，进入开发人员选项，选择 "Extension install by id"
4. 输入 Tampermonkey 的 id: `iikmkjmpaadaobahmlepeloendndfphd`
5. 等待一会，会提示安装成功，然后就可以从菜单里进入扩展界面
6. 点击“篡改猴” - “管理面板”以进入管理面板
7. 新开一个标签页，在 Greasyfork 上找到想要安装的脚本，点击“安装此脚本”，即可成功安装/更新脚本
8. 如果觉得点多次打开管理面板太麻烦，可以在浏览器新标签页添加一个快捷方式，URL 为 `chrome-extension://iikmkjmpaadaobahmlepeloendndfphd/options.html#nav=settings`。
</details>

<details><summary>Screenshots/截图</summary>

![edge_canary_tm_1](@attachment/edge_canary_tm_1.jpg) ![edge_canary_tm_2](@attachment/edge_canary_tm_2.jpg) ![edge_canary_tm_3](@attachment/edge_canary_tm_3.png) ![edge_canary_tm_4](@attachment/edge_canary_tm_4.jpg)

</details>

