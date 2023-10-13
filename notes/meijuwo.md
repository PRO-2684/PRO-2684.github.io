---
title: Meijuwo
tags: [Technical, Python]
keywords: [meijuwo, m3u8, m3u8下载, 批量下载, python, requests, bs4, BeautifulSoup4, 正则表达式, re, m3u8下载器, N_m3u8DL-RE]
description: 记一次电视剧批量下载：通过分析网页源码，编写 Python 脚本批量得到 m3u8 链接，再通过 m3u8 下载器下载
---

# 📺 记一次电视剧批量下载

> 网址：`aHR0cHM6Ly93d3cubWVpanV3by5uZXQvcGxheS81OTQwLTEtMS8=`

## 🔎 分析

打开控制台，刷新，网络 tab 筛选关键字 `m3u8`，马上就找到了视频地址，使用任意 m3u8 下载器就可以下载了~~，文章结束~~。那么它是从哪里来的呢？

![ana_1](@attachment/mjw_ana_1.png)

跟进搜索关键字 `token` 的值 `SL3RwbPjHyz0VBoF4lqJJw`，发现是请求 `super.php` 给的 (实际上已经给了完整链接，不必考虑其它部分的参数)

> 注意**筛选**和**搜索**是两个不一样的操作。筛选输入的值只在 url 里查找，而搜索则是在所有内容里查找！

![mjw_ana_2](@attachment/mjw_ana_2.png)

检查这个请求，只需要关心参数 `id`

![mjw_ana_3](@attachment/mjw_ana_3.png)

跟进搜索 `id` 的值 `CMjA0MjZfMGp1aGU=`，是写在 HTML 里的，很容易通过正则匹配到

![mjw_ana_4](@attachment/mjw_ana_4.png)

总结一下流程：HTML 内直接得到 `id` -> 向 `super.php` 提供 `id` 得到 m3u8 链接 -> 调用下载器下载

## 📦 批量

观察各集的 url，容易发现只是最后一部分在变化，并且是当前集数。写好根据 url 下载一集的函数后加个循环就可以了。但是若要做到通配，则需在最终脚本内考虑如何判断最后一集是第几集。这一点可以通过对此元素的子元素进行计数解决 (此元素也是静态写在 HTML 里的)。

![mjw_bulk](@attachment/mjw_bulk.png)

## 🐍 脚本

将一个电视剧抽象为一个类，要下载的特定电视剧则为其实例。如此做即可轻易做到通配。这里下载 m3u8 使用的工具是 [N_m3u8DL-RE](https://github.com/nilaoda/N_m3u8DL-RE)。代码中网址已脱敏。

```python
from requests import Session
from re import match, search
from bs4 import BeautifulSoup as bs
from os import system, chdir


class Teleplay:
    def __init__(self, url: str) -> None:
        '''Initialize a teleplay. `url` be like: `https://*/play/5940-1-1/`.'''
        m = match(r'(https://*/play/\d+-\d+-)\d+', url)
        if m:
            self.base = m.groups()[0]
        else:
            raise RuntimeError('Invalid url!')
        self.x = Session()
        self.x.headers.update({
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54',
            'referer': 'https://*/' # 反爬
        })
        soup = bs(self.x.get(url).text, features="html.parser")
        playlist = soup.find('ul', {'id': 'playlist'})
        self.count = len(playlist.find_all('li'))
    def fetch(self, volumn: int) -> str:
        '''Fetch m3u8 url for given volumn.'''
        assert (1 <= volumn <= self.count), f"Invalid volumn {volumn}, expected integer between 1 and {self.count}."
        url = self.base + str(volumn)
        r = self.x.get(url)
        m = search(r'"url":"(.+)","url_next":"', r.text)
        if m:
            api_id = m.groups()[0]
        else:
            raise RuntimeError('Argument `api_id` not found!')
        r = self.x.get('https://*/dplay/super.php?id=' + api_id)
        m = search(r'"url": "(.+)",', r.text)
        if m:
            m3u8 = m.groups()[0]
        else:
            raise RuntimeError('Argument `m3u8` not found!')
        return m3u8

if __name__ == '__main__':
    chdir(r'D:\Download') # 保存路径
    t = Teleplay('https://*/play/5940-1-1/') # 要下载的电视剧
    for i in range(1, t.count + 1): # 要下载的范围 (全部)
        m3u8 = t.fetch(i)
        cmd = f'.\\N_m3u8DL-RE.exe "{m3u8}" --save-name {i:0>2}'
        print(f"[{i}]>", cmd)
        system(cmd)
```

## ✅ 运行结果

> 仅演示下载两集的效果

![mjw_res](@attachment/mjw_res.png)

## 📖 开源地址

[Github gist](https://gist.github.com/PRO-2684/5d73aa01526fe1e5e994d1459349c436)

若无法访问，可尝试访问 [Pastebin](https://pastbin.net/meijuwo-68)