---
title: qq push
tags: [Technical, Python]
keywords: [Python, QQ, go-cqhttp, QQ bot, QQ 机器人]
description: 通过 go-cqhttp 自搭建 qq 定时推送
---

# 🐧 QQ push

简洁而详尽的自搭建 qq 定时推送教程。

## ☑️ 前提

* 一台云服务器或者 24h 开机的联网电脑（以 ubuntu 为例）。
* 一台电脑/一部手机，用于连接服务器。
* 一个 QQ 号（废话）。
* 一双手。
* 一个脑子。

## 🚩 步骤

1. 前往 [go-cqhttp 的 release 界面](https://github.com/Mrs4s/go-cqhttp/releases) 下载对应系统版本的可执行文件/压缩包。本文中以 `go-cqhttp_linux_amd64.tar.gz` 为例。
2. 把文件移至一个方便的地方，解压 (`tar -xf go-cqhttp_linux_amd64.tar.gz`) ，得到以下文件：
    * README.md
    * LICENSE
    * go-cqhttp
3. 赋予执行权限 `chmod +x ./go-cqhttp` 。
4. 执行 `./go-cqhttp` ，选择需要的方式。一般来说 `http` 适合定时任务， `ws-reverse` 适合交互式机器人。本文以 `http` 讲解。
5. 编辑生成的 `config.yml` 。
    * `account/uin` 改为 qq 号。
    * `message/post-format` 改为 `array` 。（推荐，非必需）
    * `servers/http` 下 `host` 改为 `127.0.0.1` ， `port` 改为任意空闲端口。
6. 再次运行可执行文件 `./go-cqhttp` ，扫码登录。登录成功后给此 qq 号发消息，终端内应该有显示。
7. `ctrl+c` 中断，使用 `screen` 或其他命令让其后台运行。
8. 推送消息的示例 Python 脚本（自行修改 `<PORT>` 为前文提到的端口， `<qq>` 为要推送到的 qq 号）：
    ```python
    from requests import post

    def report(msg: str) -> bool:
        r = post('http://127.0.0.1:<PORT>/send_private_msg', data={'user_id': <qq>, 'message': msg})
        return r.json().get('status') == 'ok'

    report('Hello world!')
    ```
9. 一切无误后即可自行编写推送脚本，并使用 `crontab` 定时执行。

## 🤔 常见问题

Q: 所给链接 (https://github.com/Mrs4s/go-cqhttp/releases) 进不去？
A: 网络问题，考虑打开代理/使用 [fastgithub](https://pro-2684.lanzouf.com/b011o8t7g)(密码 `9867`) 改善连接。
待补充...
