---
title: ICS 2023
keywords: [CS1002A, CS1002A.02, USTC, ICS, 2023, 中国科学技术大学, 计算系统概论]
description: ICS 2023 助教维护的课程主页
---

# ICS 2023 Miao

> 此网站使用了**缓存**（有效期为一天或单个会话）。若您想访问最新内容，请使用 `Ctrl+F5` 刷新此页面。
>
> 此页面的制作很多方面上~~抄袭~~参考了去年 [lly 的课程主页](https://ics.liuly.moe/)。

这里是 CS1002A.02 (2023 Fall) 班课程主页，作为课程组首页的补充。

本班课程 qq 群: `0x28724877`。

## 📖 作业

- 作业总共约 6 次
    - 约两周一次，二分制给分
    - 为了拿到分数，你至少需要完成 7/10 的作业
    - 当前进度: 5/6
- 推荐使用 Markdown 编写作业
    - 并非硬性要求，也没有隐形的加分/扣分
    - 关于 Markdown 编辑器的推荐与使用可私聊助教 (常见的有 Typora, VSCode, Obsidian 等)
- 最后提交***要求 PDF 格式***

| 序号 | 链接                                                         | DDL        | 答案                             |
| ---- | ------------------------------------------------------------ | ---------- | -------------------------------- |
| Hw1  | [hw1.pdf](/attachments/hw1.pdf) or [hw1.zip](/attachments/hw1.zip) | 2023.9.28  | [ans1.pdf](/attachments/ans1.pdf) |
| Hw2  | [hw2.pdf](/attachments/hw2.pdf) or [hw2.zip](/attachments/hw2.zip) | 2023.10.20 | [ans2.pdf](/attachments/ans2.pdf) |
| Hw3  | [hw3.pdf](/attachments/hw3.pdf) or [hw3.zip](/attachments/hw3.zip) | 2023.10.27 | [ans3.pdf](/attachments/ans3.pdf) |
| Hw4  | [hw4.pdf](/attachments/hw4.pdf) or [hw4.zip](/attachments/hw4.zip) | 2023.11.10 | [ans4.pdf](/attachments/ans4.pdf) |
| Hw5  | [hw5.pdf](/attachments/hw5.pdf) or [hw5.zip](/attachments/hw5.zip) | 2023.12.04 | [ans5.pdf](/attachments/ans5.pdf) |
| Hw6  | [hw6.pdf](/attachments/hw6.pdf) or [hw6.zip](/attachments/hw6.zip) | 2023.12.23 | [ans6.pdf](/attachments/ans6.pdf) |

### Hw1 补充说明

- T9-3 题目有误，应为求边长平方 $c^2$，而非边长 $c$ (新 PDF 内已纠正)

## 💻 实验

- 实验总共 8 次
- 助教做的实验自助评测系统：[LC-3 Simulator (ustc.edu.cn)](http://home.ustc.edu.cn/~sprout/lc3web/)

| 序号 | 链接                             | DDL       |
| ---- | -------------------------------- | --------- |
| Lab1 | [lab1.pdf](/attachments/lab1.pdf) | 2023.11.08 |
| Lab2 | [lab2.pdf](/attachments/lab2.pdf) | 2023.11.22 |
| Lab3 | [lab3.pdf](/attachments/lab3.pdf) | 2023.12.07 04:00 |
| Lab4 | [lab4.zip](/attachments/lab4.zip) | 2023.12.17 04:00 |
| Lab5 | [lab5.pdf](/attachments/lab5.pdf) | 2023.12.24 04:00 |
| Lab6 | [lab6.pdf](/attachments/lab6.zip) | 2023.12.31 04:00 |
| Lab7 | [lab7.pdf](/attachments/lab7.pdf) | 2024.01.13 04:00 |
| Lab8 | [lab8.pdf](/attachments/lab8.zip) | 2024.01.13 04:00 |

### Lab7 修正

1. 添加了文档中关于 `BLKW` 的要求
2. 修改了 `test_in.asm`，遵从文档的要求，使用 `TRAP x25`，而不是 `HALT` 等别名

## 💯 成绩

- 期中 20%
- 期末 30%
- 作业 1%*6
- 实验 5.5%*8 (可能根据难度调整对应比例)

## 📦 资源

- 教材与课件：[睿客网 - ICS2023](https://rec.ustc.edu.cn/share/57e3e4c0-4fb8-11ee-9f43-61828edc81c6) (你也可以在 群文件/教材 和 群文件/课件 内下载)
- **LC-3 Tools**
    - [LC-3 Tools 使用教程](http://acsa.ustc.edu.cn/ics/download/lc3/GuideToUsingLC3Tools.pdf) (英文)
    - [Windows 版本下载](http://acsa.ustc.edu.cn/ics/download/lc3/LC3Tools-2.0.2.exe)
    - [Mac 版本下载](http://acsa.ustc.edu.cn/ics/download/lc3/LC3Tools-2.0.2.dmg)
    - [Linux 版本下载](http://acsa.ustc.edu.cn/ics/download/lc3/lc3tools-2.0.2.tar.gz)
    - [GitHub release](https://github.com/chiragsakhuja/lc3tools/releases)
    - [Mac 下的常见问题 (来自去年主页)](https://ics.liuly.moe/faq/lc3tools.html)
- [LC-3 Web](https://wchargin.com/lc3web/)：网页版 LC-3 模拟器
    - 助教做的实验自助评测系统：[LC-3 Simulator (ustc.edu.cn)](http://home.ustc.edu.cn/~sprout/lc3web/)
- [LC-3 手册](http://acsa.ustc.edu.cn/ics/download/lc3/lc3-handbook.pdf) (英文，快速方便查找 LC-3 的汇编代码)
- Patt 主页：[Yale N. Patt (utexas.edu)](https://users.ece.utexas.edu/~patt/)
    - 点击主页里的 `EE306` 链接可以获取往年 Patt 教授这门课的课程资源（作业，考试，实验等）

## 🪲 调试

- Step over: 单步执行，但是遇到子过程**不进入**（在 LC3 内的表现为不会跟进去 JSR, JSRR）
- Step in: 单步执行，但是遇到子过程**进入**（在 LC3 内的表现为会跟进去 JSR, JSRR）
- Step out: 跳出当前子过程，继续执行父过程（在 LC3 内的表现为跳出 JSR, JSRR）
- 总结: "Step over" 会跳过当前函数内的函数调用 (JSR, JSRR)，直接到当前函数的下一行，"Step in" 会跟进去，"Step out" 会跳出来
- LC3 内你可以一直按 step in 调试代码，因为进不去的情况下它就是 step over 的效果
- 但是高级语言里倒是一般不推荐一直 step in（你也不希望 step in "printf" 这种库函数吧

## 📜 其它补充

> 这里的内容与课程无关，但是可能会对你有所帮助 😉

- [VSCode 配置各类环境（C/C++, LaTeX, Python...）](https://vscode.iw17.cc/tutorials)
- [学校 Vlab 虚拟机平台](https://vlab.ustc.edu.cn/)
- [Linux 101 入门教程](https://101.ustclug.org/)
- Todo...
