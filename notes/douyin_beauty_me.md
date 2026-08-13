---
title: 剪映/CapCut 导出的 GIF 中隐藏的元数据
tags: [Technical]
keywords: [CapCut, 剪映, GIF, 元数据, 隐私, douyin_beauty_me, UID, DID]
description: 对剪映/CapCut 导出 GIF 中不透明 UID 和 DID 字段的初步调查。
---

# 剪映/CapCut 导出的 GIF 中隐藏的元数据

[English version](/notes/douyin_beauty_me_en)

我在将一个 GIF 转换成 Telegram 使用的 VP9/WebM 贴纸时，FFmpeg 输出了一段意料之外的信息：

```text
Metadata:
  comment : {"source_type":"douyin_beauty_me","data":{...}}
```

这段注释是一份 JSON，其中包含编辑器信息、一个类似项目 ID 的 UUID，以及名为 `uid` 和 `did` 的两个字段。本文记录了对两个 GIF 的分析；它**不能**证明这些值可以识别文件作者，也不能证明它们在多次导出间保持不变。

## 自行复现

本文附带的两个 GIF 已对 UID 和 DID 进行脱敏（点击图片可在新标签页中打开并下载）：

![脱敏样本 1](/attachments/douyin_beauty_me/1.gif) ![脱敏样本 2](/attachments/douyin_beauty_me/2.gif)

```shell
ffprobe -v quiet -show_entries format_tags=comment -of default=nw=1:nk=1 1.gif
```

<details><summary>使用 ExifTool 检查</summary>

```shell
exiftool -a -u -g1 -Comment 1.gif
```

</details>

结果开头如下：

```json
{
    "source_type": "douyin_beauty_me",
    "data": {
        "appVersion": "17.5.0",
        "os": "ios",
        "product": "lv",
        "isFromEditor": 1,
        "editorScene": "editor",
        "exportType": "export",
        "videoId": "9CD9257D-516C-40AD-84B4-8A4948970F8F"
    },
    "uid": "AAAA...AAAA==",
    "did": "AAAA...AAAA==",
    "sample_sanitized": true
}
```

<details><summary>关于脱敏样本</summary>

原始 `uid` 和 `did` 可能属于敏感标识符，因此我将它们分别替换为 256 个零字节的 Base64 表示，并在 JSON 顶层添加了 `sample_sanitized:true`。除此之外，JSON 内容没有改变。

这样既能保留元数据结构，也能验证两个占位值解码后均为 256 字节：

```console
$ ffprobe -v quiet -show_entries format_tags=comment -of default=nw=1:nk=1 1.gif | python -c "import base64,json,sys; m=json.loads(sys.stdin.buffer.read().decode('utf-8-sig')); print(len(base64.b64decode(m['uid'])), len(base64.b64decode(m['did'])))"
256 256
```

公开样本无法复现原始值呈现出的高熵特征；使用全零值正是为了让替换一目了然。

</details>

## 文件中存储了什么？

这份 JSON 位于标准 GIF Comment Extension 中，两个样本的扩展块都始于文件偏移 800。这并不是 FFmpeg 对无关字节的特殊解释。

| 字段 | 样本 1 | 样本 2 |
| --- | --- | --- |
| `appVersion` | `17.5.0` | `18.8.0` |
| `os` | `ios` | `ios` |
| `product` | `lv` | `lv` |
| `videoId` | 不同的 UUID | 不同的 UUID |
| `uid` | 344 个 Base64 字符，解码后 256 字节 | 344 个 Base64 字符，解码后 256 字节 |
| `did` | 344 个 Base64 字符，解码后 256 字节 | 344 个 Base64 字符，解码后 256 字节 |

原始 UID/DID 解码后不是可读文本，其字节分布看起来具有高熵。256 字节与 RSA-2048 的输出大小相符，但这既不能确定编码方式，也不能证明其中使用了密码学机制。

<details><summary>一个类似时间戳的字段</summary>

两个文件都含有 `autoPublishTemplatePreId`：一个 UUID 后跟一个 13 位整数。将其解释为 Unix 毫秒时间戳会得到合理的日期。但该字段没有公开文档，因此目前不能称其为导出时间。

</details>

## 为什么称其为用户和设备标识符？

CapCut 将 **UID** 定义为“用户 ID”（User ID），将 **DID** 定义为“设备 ID”（Device ID），并称客服会用它们定位账号和排查问题。[^capcut_uid] 其隐私政策也说明会收集唯一设备标识符及相关技术信息。[^capcut_privacy]

这些资料只能确定 CapCut 对术语的定义，不能证明导出文件中的二进制数据等同于设置界面显示的 ID。它们可能是加密值、签名封装、临时令牌，也可能是其他数据。

## 不止 GIF

这个命名空间早于本文样本出现，也不局限于 GIF。2021 年的一篇文章曾在剪映导出的视频中发现它，其中包括 `product:"lv"`、资源 ID 和一个每次导出都会变化的 `videoId`。[^xiaozhongpai] Wikimedia Commons 还公开展示了一张经图像编辑流程处理的 JPEG 中的同名元数据。[^wikimedia]

因此，这种写入行为横跨多种格式，网站也可能将其暴露给搜索引擎。但上述案例没有较新的不透明 UID/DID 数据；本文只在两个 GIF 中确认了这些字段。

## 推测：这些不透明数据可能有什么作用？

> **警告：** 本节完全属于推测。现有样本无法区分以下可能性。

三种可能模型：

1. **厂商可解析的身份封装。** 数据中可能包含为字节跳动加密的账号或安装标识符。随机化加密会让每次导出的密文不同，但私钥持有者仍可还原相同的底层身份。
2. **公开的关联令牌。** 如果某个值对账号或设备而言是确定的，任何人都能在不解密的情况下匹配不同文件。一个值即使不能揭示姓名，也可以成为追踪标识。
3. **诊断或废弃数据。** 它们也可能只是针对单次导出的客服令牌、含义已变的旧字段，或者无法解析的数据；此时隐私影响会小得多。

使用随机化加密时，密文不同不能排除底层数据相同；但字段名和长度同样无法证明采用了这种模型。更严谨的问题是：

> 创建这些数据的一方能否将独立传播的导出文件关联到同一账号或设备？如果可以，为什么要把它们写入用户会分发的文件？

<details><summary>如何通过实验回答</summary>

1. 使用同一账号和设备多次导出同一项目。
2. 使用同一账号和设备导出多个不同项目。
3. 退出登录后重复实验。
4. 比较同一账号在两台设备上的导出结果。
5. 比较同一设备上两个账号的导出结果。
6. 在重新安装应用前后重复实验。

比较每个文件的 `uid`、`did`、`videoId`、类似时间戳的后缀，以及应用界面显示的 ID。相同的数据可以证明公开关联能力；不同的数据只能排除简单的相等匹配，不能排除厂商解析能力。

</details>

## 检查和移除元数据

ExifTool 可以在不重新编码动画的情况下移除注释：

```shell
exiftool -Comment= -o clean.gif input.gif
```

FFmpeg 也可以在解码并重新编码时移除它：

```shell
ffmpeg -i input.gif -map_metadata -1 clean.gif
```

验证结果：

```shell
ffprobe -v quiet -show_entries format_tags=comment -of default=nw=1:nk=1 clean.gif
```

没有输出即表示未发现注释。在我的测试中，即使指定 `-map_metadata -1`，添加 `-c copy` 仍会保留该扩展块。因此，如需无损移除，应使用 ExifTool；否则让 FFmpeg 重新编码。

## 初步结论

近期的两个剪映/CapCut GIF 中包含名为 UID 和 DID 的不透明字段，分别编码了 256 字节数据。在受控导出实验确定它们是否稳定或可解析之前，更准确的描述是：它们是一个**潜在的关联渠道**，而不是去匿名化的证据。

<details><summary>本文没有证明什么</summary>

- 这些数据尚未被解码，也没有与 CapCut 中显示的 ID 匹配。
- 它们在不同导出、账号、设备或应用安装间是否稳定，尚未测试。
- 本文没有证明可以识别文件作者、存在故意追踪，或可据此得出法律和安全结论。

</details>

---

[^capcut_uid]: [如何在 CapCut 中找到 UID/DID？](https://www.capcut.com/help/uid-and-did-in-capcut)，CapCut 帮助中心。

[^capcut_privacy]: [CapCut 隐私政策](https://www.capcut.com/clause/privacy-policy?lang=en)，“Technical Information”一节。

[^xiaozhongpai]: [剪映 APP 导出的视频文件会携带识别符信息](https://www.xiaozhongpai.com/p/2472)，小众派。

[^wikimedia]: [File:Ryan Kopel in Dear Evan Hansen UK Tour 04.jpg](https://commons.wikimedia.org/wiki/File:Ryan_Kopel_in_Dear_Evan_Hansen_UK_Tour_04.jpg)，Wikimedia Commons 元数据。
