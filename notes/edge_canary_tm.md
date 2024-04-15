---
title: Edge Canary for Android install Tampermonkey scripts
tags: [Latest, Useful]
keywords: [Android, Edge, Tampermonkey, Script, Install, Extension, UserScript, Greasyfork, Edge Canary, Android, 安装, 脚本, 扩展, 用户脚本, Edge Canary, 安卓]
description: This note introduces how to install Tampermonkey scripts in Edge Canary for Android. 这篇笔记介绍了如何在 Edge Canary for Android 上安装 Tampermonkey 脚本。
---

# Edge Canary for Android install Tampermonkey scripts

<style>
    article details img {
        max-width: 32%;
    }
</style>

English:

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

简体中文：

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

<details>
    <summary>Screenshots 截图</summary>

![edge_canary_tm_1](@attachment/edge_canary_tm_1.jpg) ![edge_canary_tm_2](@attachment/edge_canary_tm_2.jpg) ![edge_canary_tm_3](@attachment/edge_canary_tm_3.png) ![edge_canary_tm_4](@attachment/edge_canary_tm_4.jpg) ![edge_canary_tm_5](@attachment/edge_canary_tm_5.jpg)

</details>

