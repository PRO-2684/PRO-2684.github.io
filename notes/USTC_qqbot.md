---
title: USTC qqbot
title_custom: true
tags: [Technical, Python]
created: 2022-07-03T12:56:07.670Z
modified: 2022-09-19T01:20:36.872Z
description: 针对 USTC 学生的 QQ 机器人
---

# 🐧 USTC qqbot
为 USTC 学生（目前主要是本科生）打造的 QQ 机器人。 [Github](https://github.com/USTC-QQbot/USTC-QQbot)

## 🪄 功能
### 🎮 娱乐功能
毛子转盘、犯病、运气王/龙王提醒、掷骰子、复读、表情包识别、语录生成、拉伸图生成、发送随机/指定鹦鹉 gif。

### 🛠️ 实用功能
帮助/菜单、查看二课活动、健康打卡、查看时间戳、二维码生成、站内搜索、查看科大要闻和重要通知、获取聊天图片直链。

### 😎 管理功能
入群自动审批([USTC QQ 号证明](https://qq.ustc.life/))、禁言、配置管理、启用/禁用机器人、群组管理员。

### 📖 学业功能
$\LaTeX$ 代码渲染、 ISBN 查询、提问的智慧。

## 👀 体验
欢迎进群体验及使用机器人功能。  
测试群：963336646 (已启用自动审批功能)  
机器人账号：2142127814

## 📥 部署
若您对账号密码保存至服务器的安全性/隐私性存疑，或想定制自己的机器人，可以选择自行部署。

### ☑️ 前提
* 一台云服务器或者 24h 开机的联网电脑（以 ubuntu 为例，校内可~~白嫖~~使用 [vlab](https://vlab.ustc.edu.cn/)）。
* 一个 ssh 终端，用于连接服务器。
* 一个 QQ 号。
* 一双手。
* 一个脑子。

### 🚩 步骤
1. 前往 [go-cqhttp 的 release 界面](https://github.com/Mrs4s/go-cqhttp/releases) 下载对应系统版本的可执行文件/压缩包。本文中以 `go-cqhttp_linux_amd64.tar.gz` 为例。
2. 把文件移至一个方便的地方，解压 (`tar -xf go-cqhttp_linux_amd64.tar.gz`) ，得到以下文件：
    * README.md
    * LICENSE
    * go-cqhttp
3. 赋予执行权限 `chmod +x ./go-cqhttp` 。
4. 执行 `./go-cqhttp` ，选择 `ws-reverse`/`反向WS` 。
5. 编辑生成的 `config.yml` 。
    * `account/uin` 改为机器人 qq 号。
    * `message/post-format` 改为 `array` 。
    * `servers/http` 下 `host` 改为 `127.0.0.1` ， `port` 改为任意空闲端口。
6. 再次运行可执行文件 `./go-cqhttp` ，扫码登录。登录成功后给此 qq 号发消息，终端内应该有显示。
7. `ctrl+c` 中断，使用 `screen` 或其他命令让其后台运行。
8. 一切无误后， `git clone https://github.com/USTC-QQbot/USTC-QQbot.git` 。
9. 安装依赖库 `pip install -r requirements.txt` 。
10. 自行调整 `config_base.json` 和 `config_override.json` 。
11. 使用 `screen` 等命令保持 `bot.py` 后台运行。

### 🤔 常见问题
Q: 所给链接 (https://github.com/Mrs4s/go-cqhttp/releases) 进不去？
A: 网络问题，考虑打开代理/使用 [fastgithub](https://pro-2684.lanzouf.com/b011o8t7g) (密码 `9867`) 改善连接。

