---
title: Chromium 内置网址
tags: [Technical, Web]
keywords: [chrome, edge, favicon]
description: 此文章列出了一些以 `chrome://`, `edge://` 开头的网址，以及其使用方法
---

# Chromium 内置网址

<details><summary>Chrome</summary>

- `chrome://chrome-urls/`: 列出了一系列内置网址
- `chrome://favicon/<url>`: 返回给定 `url` 的网站图标 ([ref](https://github.com/endcloud/onetab_restore_tauri/blob/cb551edead40c77f7bd491126f994a46227b2c66/src/pages/data/components/BasicTable.tsx#L21))
    - `chrome://favicon/size/<size>@<scale>x/<url>`: 同时指定宽高为 `size`，缩放为 `scale`
    - e.g. `chrome://favicon/size/64@1x/https://github.com`
    - 用处不大，毕竟网站上无法直接通过 `<img src="chrome://favicon/size/64@1x/https://github.com">` 展示其它网站的图标

</details>

<details><summary>Edge</summary>

- `edge://edge-urls/`: 列出了一系列内置网址
- `edge://favicon/<url>`: 返回给定 `url` 的网站图标 ([ref](https://github.com/endcloud/onetab_restore_tauri/blob/cb551edead40c77f7bd491126f994a46227b2c66/src/pages/data/components/BasicTable.tsx#L21))
    - `edge://favicon/size/<size>@<scale>x/<url>`: 同时指定宽高为 `size`，缩放为 `scale`
    - e.g. `edge://favicon/size/64@1x/https://github.com`
    - 用处不大，毕竟网站上无法直接通过 `<img src="edge://favicon/size/64@1x/https://github.com">` 展示其它网站的图标

</details>
