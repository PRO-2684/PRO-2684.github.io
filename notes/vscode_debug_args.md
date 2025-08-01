---
title: VSCode 调试时传递多个命令行参数
tags: [Technical]
keywords: [VSC, VSCode, Python, launch.json, Commandline Arguments]
description: 通过配置 launch.json，实现 VSCode 内调试时传递多个命令行参数，而非仅传入一个字符串参数。
---

# VSCode 调试时传递多个命令行参数

## 问题

在 VSCode 中使用默认的“带有参数的 Python 文件”调试时，所输入的空格分隔的参数会被视为一个字符串，而非多个参数。例如，输入 `arg1 arg2` 时，实际传入的参数是 `"arg1 arg2"`，而非 `["arg1", "arg2"]`，这样就无法传递多个命令行参数。我们可以通过如下 Python 代码来验证这一点：

```python
from sys import argv

for i, arg in enumerate(argv):
    print(f"Argument #{i}: {arg}")
```

在调试时输入 `arg1 arg2`，输出结果为：

```plaintext
Argument #0: <path_to_python_file>
Argument #1: arg1 arg2
```

而我们希望的输出结果应该是：

```plaintext
Argument #0: <path_to_python_file>
Argument #1: arg1
Argument #2: arg2
```

## 结论

以 Windows 下为例，给出一个可以用的 `launch.json` 配置文件，从而可以在调试 Python 时传递多个命令行参数：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python Debugger: Python File",
            "type": "debugpy",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "args": "${command:pickArgs}"
        }
    ]
}
```

在调试时，输入 `arg1 arg2`，输出结果为：

```plaintext
Argument #0: <path_to_python_file>
Argument #1: arg1
Argument #2: arg2
```

## 说明

重点就在于 `args` 参数的设置。默认的配置如下：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python 调试程序: 包含参数的当前文件",
            "type": "debugpy",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "args": [
                "${command:pickArgs}"
            ]
        }
    ]
}
```

已知 `args` 若为数组类型，则其中的每个参数会被 escape，作为单个参数传入；若为字符串类型，则输入的参数会被原样传入。可以看到，默认配置中 `args` 是一个数组，因此输入的参数会被 escape，作为单个参数传入。而我们的配置则将 `args` 设置为字符串类型，从而实现了传递多个命令行参数的目的。

## 解决过程

1. Bing: `vscode python debug "multiple" arguments`
2. [Support expanding input parameters into multiple arguments](https://github.com/microsoft/vscode/issues/83678)
3. [Issue comment](https://github.com/microsoft/vscode/issues/83678#issuecomment-1236381454)
4. 照葫芦画瓢，写出了上面的配置文件，测试通过。
5. 欢迎大家围观我建议将 `"args": "${command:pickArgs}"` 作为默认配置的 Issue: [vscode#225834](https://github.com/microsoft/vscode/issues/225834)
