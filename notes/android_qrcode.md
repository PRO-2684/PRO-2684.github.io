---
title: Android 扫一扫软件
tags: [Useful]
keywords: [QRCode, Scanner, Android, App, 二维码扫描器, 二维码, 扫一扫]
description: This note recommends some QRCode scanner apps for Android. 这篇笔记推荐了一些 Android 平台上的扫一扫软件。
---

<style>
    article details img {
        max-width: 32%;
    }
</style>

# Android 扫一扫软件

> 起因：手机自带的扫一扫不能扫证件上的二维码，显示不支持，估计实际上是扫出来了，但是判断为隐私信息所以不给你展示；Edge 浏览器自带的扫码倒是可以扫出来，但是反手就把这个隐私信息上它的 bing 里去搜索了😅于是在应用商店和 Google Play 找了一些二维码扫描器，要么贼简单的功能都给你加好几个广告，要么不支持相册里选图。找了好久才找到下面这几个可以用的。

<details>
    <summary>参赛者一览</summary>

![qrcode_all](/attachments/qrcode_all.png)

</details>

| 名称             | 深色  | 识别率 | 历史  | API | 链接                                                                                                                                              | 备注    |
| -------------- | --- | --- | --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 扫一扫            | 🟢  | 🟡  | 🟢  | 31  | [ApkPure](https://apkpure.net/qr-code-reader-qr-scanner/tw.qrcode.banner.teacapps.barcodescanner.a)                                             |       |
| Awesome QR (1) | 🔴  | 🟢  | 🔴  | 28  | [GitHub](https://github.com/SumiMakito/AwesomeQRCode), [ApkPure](https://apkpure.net/awesome-qr/com.github.sumimakito.awesomeqrsample/download) | 二维码生成 |
| Awesome QR (2) | 🟢  | 🟡  | 🟢  | 33  | [Google Play](https://play.google.com/store/apps/details?id=com.arkm.awesome_qr_scanner)                                                        | 不支持选图 |
| 简易 QR          | 🟢  | 🟢  | 🟢  | 33  | [GitHub](https://github.com/tomfong/simple-qr), [Google Play](https://play.google.com/store/apps/details?id=com.tomfong.simpleqr)              | 二维码生成 |

## 扫一扫

> 相册图片的识别率不高，摄像头直接扫描的识别率还行。支持深色模式，但是没有生成二维码的功能。比较中规中矩的一个应用。

- 包名 `tw.qrcode.banner.teacapps.barcodescanner.a`
- 版本 v1.0.0

<details>
    <summary>查看截图</summary>

![qrcode_1_1](/attachments/qrcode_1_1.jpg) ![qrcode_1_2](/attachments/qrcode_1_2.jpg) ![qrcode_1_3](/attachments/qrcode_1_3.jpg)

</details>

## Awesome QR (1)

> **生成二维码的功能应该是这几个里最强大的**，支持 Logo、背景图、颜色等等；美中不足的是没有深色模式。

- 包名 `com.github.sumimakito.awesomeqrsample`
- 版本 v3.1.3

<details>
    <summary>查看截图</summary>

![qrcode_2_1](/attachments/qrcode_2_1.jpg) ![qrcode_2_2](/attachments/qrcode_2_2.jpg) ![qrcode_2_3](/attachments/qrcode_2_3.jpg)

</details>

## Awesome QR (2)

> 有深色模式，但是不支持相册选图。生成二维码的功能“正在开发中”。

- 包名 `com.arkm.awesome_qr_scanner`
- 版本 v1.0.0

<details>
    <summary>查看截图</summary>

![qrcode_3_1](/attachments/qrcode_3_1.jpg) ![qrcode_3_2](/attachments/qrcode_3_2.jpg) ![qrcode_3_3](/attachments/qrcode_3_3.jpg)

</details>

## 简易 QR

> **神中神，伟大无需多言**。相册选图可以编辑后再识别，也可以生成简单的二维码，支持调颜色和纠错等级。支持中文，但是机翻，建议使用英文。

- 包名 `com.tomfong.simpleqr`
- 版本 v4.1.0

<details>
    <summary>查看截图</summary>

![qrcode_4_1](/attachments/qrcode_4_1.jpg) ![qrcode_4_2](/attachments/qrcode_4_2.jpg) ![qrcode_4_3](/attachments/qrcode_4_3.jpg) ![qrcode_4_4](/attachments/qrcode_4_4.jpg) ![qrcode_4_5](/attachments/qrcode_4_5.jpg)

</details>

## 总结

想要生成花里胡哨的二维码的话，推荐使用 [Awesome QR (1)](#awesome-qr-1)；只想要扫描二维码和生成普普通通的二维码的话，推荐使用 [简易 QR](#简易-qr)。
