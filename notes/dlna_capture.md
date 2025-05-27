---
title: DLNA 捕获
tags: [Technical, Latest]
keywords: [DLNA, capture, 捕获, Windows, Media]
description: 此文介绍了如何在 Windows 下利用系统自带的 Windows Media Player Legacy 捕获 DLNA 投屏的媒体流网址
---

# DLNA 捕获

## 前言

众所周知，众多流媒体平台不再提供网页端的服务，只能在 APP 内看视频，而这就在一定程度上妨碍了我们抓包、获取网址、下载视频的工作流。为了让用户能够在智能电视上看视频，这些平台又往往会提供一个投屏到电视的选项。

虽然大家都约定俗成地说是“投屏”，但实际上这个称呼是有歧义的，既可以指“将屏幕镜像到另一个设备”，也可以指“将某媒体流投送到另一个设备”。前者需要在局域网内实时传输画面，而后者往往只需要将一个网址传输给目标设备。这里我们仅针对第二种情况展开讨论。

## Windows Media Player Legacy

既然电视上能够播放投屏的媒体流，那么理论上我们可以用电脑模拟成一个电视，让电脑接收媒体流的网址。如果我们能够得到这个网址，那么下载媒体也就不在话下了。经过一番搜索，我发现 Windows Media Player Legacy 可以接受媒体流推送，那么让我们尝试利用它来获取媒体流网址。

### 启用媒体流

首先打开控制面板，进入“网络共享中心”，点击左侧栏的“媒体流式处理选项”：

![媒体流式处理选项](/attachments/control_media_stream.jpg)

然后单击“启用媒体流”按钮：

![启用媒体流](/attachments/control_enable_media_stream.png)

<details><summary>“媒体流未启用”？</summary>

若出现下图所示“媒体流未启用”的提示：

![媒体流未启用](/attachments/control_media_stream_disabled.png)

那么点击下方的“Windows 服务管理工具”，然后找到“Windows Media Player Network Sharing Service”服务：

![“Windows Media Player Network Sharing Service”服务](/attachments/service_wmp.png)

右键，选择“属性”，将其启动类型设置为“自动”或者“自动（延迟启动）”，点击“应用”后再次点击“启动”：

![“Windows Media Player Network Sharing Service”服务属性设置](/attachments/service_wmp_prop.png)

若提示下述信息：

```text
Windows 无法启用 Windows Media Player Network Sharing Service 服务 (位于 本地计算机 上)
错误 1068: 依赖服务或组无法启动。
```

则先用同样方法启动“依存关系”中的五个服务 ([ref](https://answers.microsoft.com/zh-hans/windows/forum/all/windows%E6%97%A0%E6%B3%95%E5%90%AF%E7%94%A8windows/2a007912-941f-4470-9e7e-9b0627123edc))：

![依存关系](/attachments/service_dependencies.png)

- Windows Search
- Background Tasks Infrastructure Service
- Remote Procedure Call (RPC)
- DCOM Server Process Launcher
- RPC Endpoint Mapper

启动成功后即可关闭“服务”窗口，然后 **重新进入** 控制面板的“媒体流选项”。

</details>

随后，在所有网络中允许访问共享媒体：

![允许访问共享媒体](/attachments/control_allow_accessing_media.png)

完成上述步骤后即可关闭控制面板。

### 允许远程控制我的播放器

打开 Windows Media Player Legacy (找不到可以搜索) 软件，在“媒体流”选项中勾选“允许远程控制我的播放器”：

![允许远程控制我的播放器](/attachments/wmp_legacy_allow_remote_control.png)

注意，这一步之后不能关闭 Windows Media Player Legacy，否则会导致后续找不到设备。

### 开始投屏

将手机或其他设备连接到同一局域网，打开一个支持 DLNA 的 APP (如哔哩哔哩)，并打开任意视频 (例如 [BV1GJ411x7h7](https://b23.tv/BV1GJ411x7h7))，在播放界面点击投屏按钮，选择你的电脑：

![哔哩哔哩投屏](/attachments/bilibili_screencast.jpg)

如果一切正常，Windows Media Player Legacy 就会开始播放此视频：

![Windows Media Player Legacy 播放](/attachments/wmp_legacy_playing.png)

### 查看网址

右键画面，点击“显示播放列表”：

![显示播放列表](/attachments/wmp_legacy_show_playlist.png)

随后在播放列表中找到刚才投屏的视频，右键点击，选择“属性”：

![播放列表属性](/attachments/wmp_legacy_playlist_properties.png)

在弹出的属性窗口中的“文件”选项卡中即可看到视频的 URL，使用鼠标从头到尾选中后即可复制：

![播放列表属性 URL](/attachments/wmp_legacy_playlist_url.png)

随后可以将此 URL 粘贴到浏览器或下载工具中进行下载。

## DLNA 协议

显然，上面的方法还是太吃操作了，那么有没有更自动化的方式呢？答案是有的，但需要编写一个程序扮演 DLNA DMR (Digital Media Renderer) 的角色，自动接收媒体流并提取 URL。

> **Digital Living Network Alliance** (**DLNA**) is a set of [interoperability](https://www.wikiwand.com/en/articles/Interoperability "Interoperability") standards for [sharing](https://www.wikiwand.com/en/articles/Sharing "Sharing") home [digital media](https://www.wikiwand.com/en/articles/Digital_media "Digital media") among [multimedia](https://www.wikiwand.com/en/articles/Multimedia "Multimedia") devices.

TBD

为了达成这个目的，我们需要解决两个问题：

1. 向网络广播，告知所有设备：“我是 DMR，我可以接受媒体流然后渲染”
2. 接收发给自己的控制指令，然后输出指令的内容，从而获得网址

TBD

## 后言

TBD
