---
title: Shell 与 Terminal 的联系与区别
tags: [Technical]
keywords: [shell, terminal, cmd, powershell, conhost, windows terminal]
description: 本文简单介绍了 Shell 与 Terminal 的联系与区别，并以 Windows 为例列举了常见的 Shell 与 Terminal。
---

# Shell 与 Terminal 的联系与区别

- Shell: Shell 是一个**命令行解释器**，它接收用户输入的命令并执行。你可以将其与编程语言进行对比，它相当于编程语言中的解释器，而用户输入的命令相当于编程语言中的代码。
- Terminal: Terminal 是一个**命令行界面**，通常翻译为终端。它提供了一个 Shell 的界面，让用户可以与 Shell 进行交互。
- 可以简单理解为 Terminal 是 Shell 的 UI 界面，用户输入的命令会被 Terminal 传递给 Shell，Shell 执行完命令后，将结果返回给 Terminal，Terminal 再将结果显示给用户。
- Windows 下的举例:
    - Terminal: Windows Terminal (简称 wt), conhost.exe
    - Shell: cmd, PowerShell (简称 pwsh)
- 只要 Terminal 与 Shell 均支持相应的协议，就可以在任意 Terminal 中使用任意 Shell。在 Windows 下，你可以通过 Windows Terminal 使用 cmd, PowerShell, 也可以通过 conhost.exe 使用 cmd, PowerShell。

<details>

<summary>示例</summary>

|      | conhost | wt |
| ---- | ------- | -- |
| cmd  | ![conhost.exe + cmd](/attachments/conhost_cmd.jpg) | ![Windows Terminal + cmd](/attachments/wt_cmd.jpg) |
| pwsh | ![conhost.exe + PowerShell](/attachments/conhost_pwsh.jpg) | ![Windows Terminal + PowerShell](/attachments/wt_pwsh.jpg) |

</details>

