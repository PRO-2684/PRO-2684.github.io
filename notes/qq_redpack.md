---
title: QQ 一笔画红包发送助手
tags: [Latest, Useful]
keywords: [QQ, 一笔画红包, 一笔画]
description: 此工具可以帮助你发送 QQ 一笔画红包
scripts: true
---

<style>
    div.options {
        display: inline-block;
        padding: 0 10px;
    }
</style>

# QQ 一笔画红包发送助手

## ✨ 工具

> 说明：在下方输入框内输入想要发送到的目标，选择类型，随后点击发送即可。

<form>
    <input autofocus name="qq" placeholder="请输入 QQ 号">
    <fieldset>
        <legend>发送给:</legend>
        <div class="options">
            <input type="radio" id="group" value="3" name="dest-type" checked />
            <label for="group">群聊</label>
        </div>
        <div class="options">
            <input type="radio" id="buddy" value="2" name="dest-type" />
            <label for="buddy">好友</label>
        </div>
    </fieldset>
    <button type="submit">发送</button>
</form>

## 🤔 原理

打开链接 `https://h5.qianbao.qq.com/sendRedpack/index?_wv=67112960&_wvNt=0xFFFFFF&_wvSb=1&recv_uin=<qq>&recv_type=<type>`，其中 `<qq>` 为目标 QQ 号，`<type>` 为目标类型（`2` 为好友，`3` 为群聊）。
