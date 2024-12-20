---
title: android
tags: [Technical]
keywords: [Android, adb, root, Magisk, bootloader, url scheme, 第三方软件, 自定义快捷方式]
description: 提升 Android 使用体验：第三方软件、自定义快捷方式、ADB、Root
---

# 🤖 Android 使用体验提升

## 🚪 入门

### 第三方软件

除了官方发布的软件，还有大量的第三方软件能给你带来**不一样的体验**。

以下为个人使用的第三方软件：

* 贴吧 Lite (替代百度贴吧)
* Niagara Launcher (替代系统桌面)
* 几何天气 (替代系统自带天气)
* 待补充...

⚠️ 注意甄别软件安全性以及信誉，*不可信软件可能导致平台账号被盗/丢失*

### 自定义快捷方式与 url scheme

通过自定义快捷方式，可以极大地**提高常用操作的效率**。比如说一般情况下你要打开微信扫一扫，需要点 3 次 (打开微信 - + - 扫一扫)，但是如果你添加了快捷方式，点击一下就够了。

选项1: 酷安搜索“创建快捷方式”即可安装。该软件可以让你创建几乎任意软件任意 Activity 的快捷方式 (部分需要 root)

选项2: 酷安搜索“Anywhere-”即可安装。该软件相较于前一个拥有更多功能，可以创建各类快捷方式 (Activity, URL, shell, Workflow)，支持更多工作方式 (普通, adb, root) 并且界面更美观

## 🔭 进阶 - ADB

ADB 是 "Android Debug Bridge" 的简称。通过它，你可以**做到正常情况下做不到的事**，例如用户层面卸载/冻结系统软件等。

1. 启用 ADB: 打开设置，找到系统版本一栏，多次点击，即可进入开发者模式 (不同手机可能具体操作不一样)。进入设置中多出来的开发者选项，启用 USB 调试
2. 电脑下载 [platform-tools](https://developer.android.google.cn/studio/releases/platform-tools#downloads), 解压至一个合适的路径 (最好不要有中文、空格和非常规符号)
3. 当前路径打开终端，输入 `adb` 并回车，若出现说明文档则 ADB 工具安装成功。
4. (可选) 将当前路径添加到 PATH
5. 手机通过 USB 连至电脑，`adb devices` 可以看见多出了一个设备，手机上同意后即可执行 adb 命令，例如你可通过 `adb shell` 进入手机的 shell

市面上有一批不需要 root，只需要 adb 权限就可以运行各类神奇功能的软件，比如说冰箱，黑阈等，可自行探索。

⚠️ 注意，与权力伴随而来的是危险，拥有 ADB 权限的恶意软件*可以对系统造成可观的破坏*。

## 🎓 高级 - Root

Root 就是 Android 内的超级用户 `su`, 拥有了这个权限才是**完全掌控了手机**。相较于 ADB, 其权限更高，可以实现的操作更多，带来的风险也随之更大，门槛也更加高。

当下主流的 Root 方案是购入小米手机/二手机，解锁 Bootloader 后刷入 Magisk 获取 Root 权限。随后一般会开启 Zygisk 后刷入 LSPosed (Zygisk), 至此便可以方便地安装各类模块以进一步自定义手机。

⚠️ 注意，不规范操作或者授予恶意软件 Root 权限*可能导致手机系统损坏甚至于无法开机*！

[Root 参考教程](http://magiskcn.com/)