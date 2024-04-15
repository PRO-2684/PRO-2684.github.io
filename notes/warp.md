---
title: Warp 的首次配置
tags: [Technical]
keywords: [VPN, Warp, Cloudflare, Warp+, 1.1.1.1, 首次配置, 配置, 配置问题, 连接问题, 连接, 问题]
description: 此文介绍了 Warp 的首次配置中可能遇到的连接问题及其产生原因，同时给出了 Windows 以及 Android 下的解决方案
---

# Warp 的首次配置

Cloudflare 推出的 [Warp](https://blog.cloudflare.com/1111-warp-better-vpn-zh-cn) 是一款旨在改善移动互联网的性能和安全性的服务。Warp 是一种适用于所有人的 VPN 服务，可以加速访问速度，并利用 Cloudflare 的骨干网络和 DNS 保护用户的网络安全。

## 🤔 问题

首次连接 Warp+ 时，可能会遇到连接失败/一直连接的情况，如下图所示：

![Connecting](@attachment/warp_connecting.png)

这种情况很可能是由于网络环境，导致 Warp 无法连接到 Cloudflare 的服务器下载必要的配置文件，从而无法正常连接。那么我们可以考虑让 Warp 通过代理连接到 Cloudflare 的服务器下载配置文件，从而解决这个问题。

由于 Warp 并没有提供设置代理的功能，那么我们首先想到的就是让 Warp 通过 VPN 连接到 Cloudflare 的服务器下载配置文件。但是，由于 Warp+ 本身就是一款 VPN 服务，在开启 Warp+ 的时候之前设置的 VPN 会被系统关闭，这就陷入了死循环。

使用下面提到的方法就可以解决这个问题，并且第一次连接成功后，就可以正常使用 Warp+ 了。

## 📱 解决方案 - Android

> 此部分内容改自 [Android 使用 WARP | tanglu's blog](https://blog.tanglu.me/WARP-for-Android/)

### 方案一 - 电脑共享代理

1. 电脑端 Clash 设置内打开 `局域网连接` / `Allow LAN` 或相同含义的选项，同时记下显示的端口号 `PORT`。此过程中 Windows 可能会弹出防火墙提示，选择允许即可。
    ![图示](@attachment/warp_android_1_1.png)
2. 在电脑上开启热点，手机连接热点；或者手机开启热点，电脑连接热点；或者手机电脑都连接同一个路由器。（使手机电脑在同一个局域网中，后用 WLAN_A 指代）
3. 获取电脑在 WLAN_A 的 IP 地址 `IP`
4. 手机设置 WLAN_A 的代理为手动，主机名填写 `IP`，端口填写 `PORT`，保存。
5. 手机开启 Warp+，等待一会即可连接成功。

### 方案二 - Clash For Android 提供代理

> 此方案以 Clash For Android 为例，其他软件类似。

1. 关闭 `Clash-设置-网络-自动路由系统流量`
2. 以小米为例，打开 `设置-双卡与移动网络`，点击上网卡，进入 `接入点名称 (APN)`，点击 `新建 APN`
    - 名称：随便填，记得住就好，例如 `localhost (Clash)`
    - 代理：`127.0.0.1`
    - 端口：`7890` (Clash For Android 默认端口，如果你改了，就填你改的端口)
    - 其他选项保持默认/和原有 APN 一致即可
3. 保存，然后选择新建的 APN
4. 打开 Clash For Android，开启代理，使用浏览器确认是否可以正常访问网页
5. 打开 Warp+，等待一会即可连接成功

## 🪟 解决方案 - Windows

这里的思路其实和 Android 的方案一模一样，只是手机电脑角色互换。

### 方案一 - 手机共享代理

此方案本人未测试，但是理论可行。具体来说，就是让手机充当代理服务器，电脑连接手机的代理，然后开启 Warp+ 即可。由于方案二已经足够简单，此处不再赘述。

### 方案二 - Clash Verge 提供代理

> 此方案以 Clash Verge 为例，其他软件 (例如 Clash for Windows) 类似。

1. 打开 Clash Verge 设置，关闭 `Tun 模式`、`服务模式`，打开 `系统代理`
2. 打开 Warp+，等待一会即可连接成功

## 😢 仍然无法连接？

考虑清除 Warp 的数据，或者卸载重装，随后再次尝试。
