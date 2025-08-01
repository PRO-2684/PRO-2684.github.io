---
title: 一加 13 Root 教程 (以 KSU 为例)
tags: [Technical, Latest]
keywords: [OnePlus, OnePlus 13, Android, Root, KSU, KernelSU, Payload Dumper, Pay10ad Dumper, 一加, 一加 13, 安卓]
description: 一加 13 新版系统 Root 并刷入 KernelSU 的教程。
---

# 一加 13 Root 教程 (以 KSU 为例)

## 💬 前言

最近的小米 11 pro 也是不出意外地出意外了，wifi 还是烧了，而返厂维修需要一个星期左右，遂决定买一款新手机。由于小米高考政策，因此再三考虑后买了国行一加 13。在 Root 过程中还是踩了不少坑的，因此把过程尽可能详细地记录在这里，希望能帮助有需要的人。

## #️⃣ Root 过程

### 📥 下载安装 ADB 以及驱动

- [ADB](https://developer.android.google.cn/tools/releases/platform-tools?hl=zh) - 解压至趁手的位置
- [驱动](https://dl.google.com/android/repository/usb_driver_r13-windows.zip) - 右键安装

### 🔓 OEM 解锁

1. 手机打开 `设置` - `关于本机` - `版本信息`，连续点击 `版本号`，直至提示开发者模式已开启，同时记下 `版本号` 备用 (例如 `PJZ110_15.0.0.840(CN01)`)。
2. `设置` - `系统与更新` - `开发者选项`，打开 `OEM 解锁` 与 `USB 调试`。
3. 连上电脑，执行 `adb reboot bootloader`，手机授权后即进入 Bootloader 界面。
4. 执行 `fastboot flashing unlock`。
5. 手机通过音量键选中 `UNLOCK THE BOOTLOADER`，随后按下电源键确认，等待重启。
6. 重启之后进入 `开发者选项`，可以看到 `OEM 解锁` 这一项已经灰了，下面有行小字写着“引导加载程序已解锁”。

<details><summary>
第 4 步卡在 `waiting for device`?
</summary>

1. 右键 Windows Logo - `设备管理器`，展开 `其它设备`。
2. 找到你的手机，名字一般会和 `Android` 沾边，并且会带有 `⚠️`/`❔` 的角标。
3. 右键 - `更新驱动程序` - `浏览我的电脑以查找驱动程序(R)` - `让我从计算机上的可用驱动程序列表中选取(L)` - `Android Device` - `Android Bootloader Interface` - 一直确认。
4. 若终端仍然没反应，则 Ctrl+C 中断后重新执行。

</details>

### 📥 寻找合适的 OTA 包

打开 [XDA Forums](https://xdaforums.com/t/rom-ota-repository-of-oxygenos-coloros-full-otas-oxygenos-15-0-0-840-coloros-15-0-0-840.4718692/)，找到合适的 OTA 包：

1. 例如前面记下来的版本号 `PJZ110_15.0.0.840(CN01)`，以下划线和括号为界分为三部分：
    1. `PJZ110`
    2. `15.0.0.840`
    3. `CN01`
2. 将第三部分和第一部分拼接，展开对应的 Spoiler (CN PJZ110)
3. 在出现的列表中找到版本号 `15.0.0.840`
4. 右键复制链接，记为 `<OTA_ZIP_URL>`（注意：不能直接点击下载！）

![xda_copy_link.png](/attachments/xda_copy_link.png)

### 📦 提取 `init_boot`

#### Pay10ad Dumper

> 推荐：无需下载完整文件，仅需几秒钟即可提取出 `init_boot`。

1. 打开 [Releases](https://github.com/PRO-2684/pay10ad-dumper/releases)，下载名字里带 `windows` 的压缩包并解压至趁手的地方。
2. 执行 `./pay10ad-dumper.exe -u curl -p init_boot <OTA_ZIP_URL>`
3. 等待几秒，即可在 `output` 文件夹下看到 `init_boot.img`

![sample-remote-zip.png](https://raw.githubusercontent.com/PRO-2684/pay10ad-dumper/refs/heads/main/images/sample-remote-zip.png)

#### 传统方法

传统方法需要下载完整文件并解压，有的还不支持仅提取特定分区。

- [`vm03/payload_dumper`](https://github.com/vm03/payload_dumper)
- [`5ec1cff/payload-dumper`](https://github.com/5ec1cff/payload-dumper)
- [`payload-dumper-go`](https://github.com/ssut/payload-dumper-go)

### 🩹 修补

1. 下载安装 [KernelSU](https://kernelsu.org/zh_CN/guide/installation.html) 管理器
2. 将 `init_boot.img` 复制到手机
3. 打开 KernelSU，点击右上角安装图标，随后点击 `选择并修补一个文件`
4. 选择 `init_boot.img`，等待修补完成
5. 将修补后文件 `kernelsu_patched_xxxxxxxx_xxxxxx.img` 复制到电脑

### 💿 刷写

```shell
adb reboot bootloader
fastboot flash init_boot .\kernelsu_patched_xxxxxxxx_xxxxxx.img
fastboot reboot
```

## 🕳️ 坑

- ColorOS 新版系统无法通过 GKI 模式的 `fastboot boot boot.img` 安装 KSU，如果执行了 `fastboot flash boot boot.img` 还会 boot loop ([Zhihu](https://zhuanlan.zhihu.com/p/5997534807#h_5997534807_12))
- 浏览器 UA 无法访问 OTA 包 (可以换 UA，或者 [替换网址](https://xdaforums.com/t/rom-ota-repository-of-oxygenos-coloros-full-otas-oxygenos-15-0-0-840-coloros-15-0-0-840.4718692/post-89955793))

## 🎉 致谢

- [Lufs's Blog](https://blog.isteed.cc/post/oneplus-13-root-guide/)：[下载安装 ADB 以及驱动](#-下载安装-adb-以及驱动) 以及 [OEM 解锁](#-oem-解锁) 章节就是参考这个教程的。
- [Zhihu](https://zhuanlan.zhihu.com/p/5997534807#h_5997534807_12)：按照上一条的教程安装 KSU 失败后在这里找到了解决方案。
- [XDA Forums](https://xdaforums.com/t/rom-ota-repository-of-oxygenos-coloros-full-otas-oxygenos-15-0-0-840-coloros-15-0-0-840.4718692/)：提供了全面的一加 13 固件下载地址以及下载教程。
