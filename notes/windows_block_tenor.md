---
title: 阻止 Windows 11 Emoji 选择器中的 Tenor GIF 搜索
tags: [Technical, Latest]
keywords: [Windows 11, Emoji, GIF, Tenor, 搜索, 阻止, 禁用]
description: 此文介绍了如何阻止 Windows 11 Emoji 选择器中的 Tenor GIF 搜索
---
# 阻止 Windows 11 Emoji 选择器中的 Tenor GIF 搜索

## 方案 1 - 阻止程序联网

> 🟢 已测试，有效。[Reference](https://l.opnxng.com/r/Windows11/comments/v5q1v6/how_to_disable_tenor_gif_search_in_emoji_picker/)

1. 打开 `高级安全 Windows Defender 防火墙`
2. 选中 `出站规则`，右键并选择 `新建规则`
3. 规则类型选择程序
4. 程序选择 `此程序路径`，然后填入 `C:\Windows\SystemApps\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\TextInputHost.exe`
5. 操作选择 `阻止连接`
6. 配置文件默认全选即可
7. 名称和描述自己填，例如 `Fuck tenor`
8. 完成

注意，删除此程序会导致 Emoji 面板、剪贴板等功能完全无法使用，所以只能禁用联网。

## 方案 2 - 阻止相关域名

> 🟡 未测试。[Reference](https://eblocker.org/community/main-forum/solution-how-to-disable-tenor-gif-in-windows-11-emoji-picker/)

修改 Hosts 文件，阻止如下域名：

- `g.tenor.com`
- `media.tenor.com`
- `inputsuggestions.msdxcdn.microsoft.com` (阻止搜索建议)

## 代理软件设置

上述规则可能会在开代理时失效。若您正在使用 [Clash Nyanpasu](https://nyanpasu.elaina.moe/) 作为代理软件，则可以通过全局链在打开代理的情况下继续阻止相关域名。作者的示例配置文件如下：

```yaml
# Clash Nyanpasu Merge Template (YAML)
# Documentation on https://nyanpasu.elaina.moe/
# Set the default merge strategy to recursive merge.
# Enable the old mode with the override__ prefix.
# Use the filter__ prefix to filter lists (removing unwanted content).
# All prefixes should support accessing maps or lists with a.b.c syntax.

rule-providers:
  reject:
    type: http
    behavior: classical
    url: "https://github.com/ignaciocastro/a-dove-is-dumb/raw/refs/heads/main/clash.yaml"
    path: ./ruleset/reject.yaml
    interval: 86400
prepend__rules:
- 'DOMAIN,g.tenor.com,REJECT'
- 'DOMAIN,media.tenor.com,REJECT'
- 'DOMAIN,inputsuggestions.msdxcdn.microsoft.com,REJECT'
- 'DOMAIN,otheve.beacon.qq.com,REJECT'
- 'DOMAIN,tpstelemetry.tencent.com,REJECT'
- 'DOMAIN,h.trace.qq.com,REJECT'
- 'DOMAIN,report.gamecenter.qq.com,REJECT'
- 'RULE-SET,reject,REJECT'
```

## 🖼️ 效果

![1](/attachments/tenor_1.jpg)

![2](/attachments/tenor_2.jpg)

虽然说 Gif 是给干掉了，但是那个图标还在那里就很蛋疼。不知道有没有好办法把图标也干掉。
