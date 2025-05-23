---
title: Font Awesome 图标导出为 SVG
tags: [Technical, Web]
keywords: [分析, font, Font Awesome, SVG, 字体]
description: 这篇文章介绍了一种通过 [Woff2 to SVG 字体转换器](https://www.fontconverter.io/en/woff2-to-svg) 和 [IcoMoon](https://icomoon.io/app) 将 Font Awesome 字体中选定图标导出为 SVG 的方法
scripts: false
---

# Font Awesome 图标导出为 SVG

> ⚠️ 免责声明：本文仅供学习交流使用，不得用于商业用途。所有图标版权归 [Font Awesome](https://fontawesome.com/) 所有。

## 1. 寻找图标

在 [Font Awesome](https://fontawesome.com/search) 中寻找想要的图标，并点开，例如 [这个图标](https://fontawesome.com/icons/image?f=classic&s=light)：

![fa-1](/attachments/fa-1.jpg)

## 2. 下载字体

打开开发者工具 - 网络，勾选“禁用缓存”，刷新界面，然后筛选出所有字体文件：

![fa-2](/attachments/fa-2.jpg)

根据代码框中的内容 `<i class="fa-light fa-image"></i>`，可以确定我们想要的是 `light` 变种，那么我们就可以搜索到所要的字体文件：

![fa-3](/attachments/fa-3.jpg)

右键 - 新标签页中打开即可下载到一个 `.woff2` 字体文件。同时，复制此图标对应的 Unicode 码 (`f03e`)：

![fa-4](/attachments/fa-4.jpg)

## 3. 转换为 SVG 字体

打开 [Woff2 to SVG 字体转换器](https://www.fontconverter.io/en/woff2-to-svg)，将刚才下载的 `.woff2` 字体导入，然后点击 "Convert to svg"，待其完成后点击 "Download converted font"：

![fa-5](/attachments/fa-5.jpg)

得到一个 `.zip` 压缩包，提取出压缩包内的 `.svg` 文件：

![fa-6](/attachments/fa-6.jpg)

## 4. 导出单独的 SVG

打开 [IcoMoon](https://icomoon.io/app) 网站，点击导航栏左侧 "Import Icons"，选择刚才提取的 `.svg` 文件，等待处理完成。可能会跳出提示框，选择 "No" 即可。处理完成后如图所示：

![fa-7](/attachments/fa-7.jpg)

在导航栏的搜索处输入 [第二步](#2-下载字体) 复制的 Unicode 码，稍等片刻即可看到想要的图标出现：

![fa-8](/attachments/fa-8.jpg)

点击以选中想要的图标，然后点击左下侧的 "Generate SVG & More"，将鼠标悬浮在想要的图标上：

![fa-9](/attachments/fa-9.jpg)

点击 "Get Code"，即可获得 SVG path：

![fa-10](/attachments/fa-10.jpg)

若想要导出一个单独的 SVG，将 "Symbol Definition(s)" 内的 `<symbol>` 标签替换成 `<svg>` 标签，移除 `<svg>` 的 `id` 属性，随后向 `<svg>` 添加属性 `xmlns="http://www.w3.org/2000/svg"` 即可。例如这个图标的 "Symbol Definition(s)" 为：

```xml
<symbol id="icon-uniF03E" viewBox="0 0 32 32">
<path d="M4 4q-0.875 0-1.438 0.563v0 0q-0.563 0.563-0.563 1.438v14.563l4.25-4.188q0.75-0.75 1.75-0.75t1.75 0.75l4.25 4.188 8.25-8.188q0.75-0.75 1.75-0.75t1.75 0.75l4.25 4.188v-10.563q0-0.875-0.563-1.438t-1.438-0.563h-24zM2 23.438v2.563q0 0.875 0.563 1.438t1.438 0.563h2.563l6-6-4.188-4.25q-0.375-0.25-0.75 0l-5.625 5.688zM24.375 13.75q-0.375-0.25-0.75 0l-14.188 14.25h18.563q0.875 0 1.438-0.563t0.563-1.438v-6.563l-5.625-5.688zM0 6q0.063-1.688 1.188-2.813v0 0q1.125-1.125 2.813-1.188h24q1.688 0.063 2.813 1.188t1.188 2.813v20q-0.063 1.688-1.188 2.813t-2.813 1.188h-24q-1.688-0.063-2.813-1.188t-1.188-2.813v-20zM10 9q-0.063-0.938-1-1-0.938 0.063-1 1 0.063 0.938 1 1 0.938-0.063 1-1v0zM6 9q0.063-1.688 1.5-2.625 1.5-0.75 3 0 1.438 0.938 1.5 2.625-0.063 1.688-1.5 2.625-1.5 0.75-3 0-1.438-0.938-1.5-2.625v0z"></path>
</symbol>
```

那么最终的 SVG 为：

```xml
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
<path d="M4 4q-0.875 0-1.438 0.563v0 0q-0.563 0.563-0.563 1.438v14.563l4.25-4.188q0.75-0.75 1.75-0.75t1.75 0.75l4.25 4.188 8.25-8.188q0.75-0.75 1.75-0.75t1.75 0.75l4.25 4.188v-10.563q0-0.875-0.563-1.438t-1.438-0.563h-24zM2 23.438v2.563q0 0.875 0.563 1.438t1.438 0.563h2.563l6-6-4.188-4.25q-0.375-0.25-0.75 0l-5.625 5.688zM24.375 13.75q-0.375-0.25-0.75 0l-14.188 14.25h18.563q0.875 0 1.438-0.563t0.563-1.438v-6.563l-5.625-5.688zM0 6q0.063-1.688 1.188-2.813v0 0q1.125-1.125 2.813-1.188h24q1.688 0.063 2.813 1.188t1.188 2.813v20q-0.063 1.688-1.188 2.813t-2.813 1.188h-24q-1.688-0.063-2.813-1.188t-1.188-2.813v-20zM10 9q-0.063-0.938-1-1-0.938 0.063-1 1 0.063 0.938 1 1 0.938-0.063 1-1v0zM6 9q0.063-1.688 1.5-2.625 1.5-0.75 3 0 1.438 0.938 1.5 2.625-0.063 1.688-1.5 2.625-1.5 0.75-3 0-1.438-0.938-1.5-2.625v0z"></path>
</svg>
```

效果图：

![fa-11](/attachments/fa-11.jpg)
