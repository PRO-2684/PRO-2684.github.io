---
title: 子网小工具
tags: [Useful, Latest]
keywords: [Subnet, 子网, IP]
description: 二进制子网掩码和人类可读的表示法（点十进制表示法加长度）之间互相转换
scripts: true
---

<style>
    span.example {
        text-decoration: underline;
        cursor: pointer;
    }
    span#primary, span#primary-result {
        font-weight: bold;
    }
    span.name {
        user-select: none;
    }
    span.name::after {
        content: ": ";
    }
</style>

# 子网小工具

> 注意：本工具没有任何形式的错误检查，输入错误的数据可能会导致无法预知的结果。

## 🪄 功能

将二进制子网掩码转换为人类可读的表示法（点十进制表示法加长度），反之亦然。此外，它还可以提供给定子网中的可用 IP 范围和数量。

[Python 版本](https://github.com/PRO-2684/gadgets/tree/main/subnet_helper)

## 🍻 例子

- <span class="example">225.128.0/9</span>
- <span class="example">11100000 00</span>

## ✨ 工具

<input id="query">

<span id="primary" class="name">Human-friendly</span><span id="primary-result" class="value">0.0.0.0/0</span>

<span id="count" class="name">Available IP count</span><span class="value">2^<span id="count-len">32</span> = <span id="count-val">4294967296</span></span>

<span id="range" class="name">Available IP range</span><span class="value"><span id="start">0.0.0.0</span> - <span id="end">255.255.255.255</span></span>

<span id="range-bin" class="name">Available IP range (bin)</span><span class="value"><span id="start-bin">00000000 00000000 00000000 00000000</span> - <span id="end-bin">11111111 11111111 11111111 11111111</span></span>
