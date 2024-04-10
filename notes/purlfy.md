---
title: 🧹 pURLfy / 链接净化
tags: [Useful]
keywords: [Javascript, Purify, Purifier, Link, URL, Clean, Link Purifier]
description: A simple rule-based link purifier to remove tracking parameters from URLs.
scripts: true
---

# 🧹 pURLfy / 链接净化

## Introduction / 介绍

This is a rule-based link purifier to remove tracking parameters from URLs. The GitHub repository can be found [here](https://github.com/PRO-2684/pURLfy).

这是一个基于规则的链接净化器，用于从 URL 中删除跟踪参数。GitHub 仓库可以在 [这里](https://github.com/PRO-2684/pURLfy) 访问。

## Usage / 使用

Just paste the URL into the input box and hit enter. The cleaned URL will be displayed in the output box. Note that `redirect` mode rules has been disabled due to the limitation of the browser.

只需将 URL 粘贴到输入框中并按回车，清理后的 URL 将显示在输出框中。请注意，由于浏览器的限制，`redirect` 类型的规则被禁用。

- Input / 输入: <input autofocus placeholder="https://example.com/?utm_source=qq" id="input" disabled title="Loading rules..."></input>
- Result / 结果: <input readonly placeholder="https://example.com/" id="url"></input>
- Match / 匹配: <input readonly placeholder="Fallback by PRO-2684" id="rule"></input>
