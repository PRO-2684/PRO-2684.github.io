---
title: VSCode URI Schemes
tags: [Technical]
keywords: [VSC, VSCode, Visual Studio Code, URI, schemes]
description: A list of URI schemes that you can use for VSCode.
---

# VSCode URI Schemes

[English version](#open-a-project-or-file) | Insiders: `vscode:` -> `vscode-insiders:`

## 打开一个项目或文件

> 参考：[Opening VS Code with URLs - VSCode Documentation](https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls)

- 打开一个项目
    - `vscode://file/{full-path-to-project}/`
    - e.g. [`vscode://file/c:/myProject/`](vscode://file/c:/myProject/)
- 打开一个文件
    - `vscode://file/{full-path-to-file}`
    - e.g. [`vscode://file/c:/myProject/package.json`](vscode://file/c:/myProject/package.json)
- 打开一个文件，精确到行与列
    - `vscode://file/{full-path-to-file}:{line}:{column}`
    - e.g. [`vscode://file/c:/myProject/package.json:5:10`](vscode://file/c:/myProject/package.json:5:10)

## 打开设置

> 参考：[Opening VS Code with URLs - VSCode Documentation](https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls)

- `vscode://settings/{setting-id}`
- e.g. [`vscode://settings/editor.wordWrap`](vscode://settings/editor.wordWrap)

## 打开扩展

> 尝试从 [Visual Studio Marketplace](https://marketplace.visualstudio.com/) 安装 [任意扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)

- `vscode:extension/{extension-id}`
- e.g. [`vscode:extension/ms-vscode.cpptools`](vscode:extension/ms-vscode.cpptools)

## 扩展注册的 URI

> 参考：[What options are available to use with the vscode:// url scheme? - Stack Overflow](https://stackoverflow.com/q/67491505/16468609)

- `vscode://{extension-id}/...`
- e.g. [`vscode://vscode.git/clone?url=https://github.com/microsoft/vscode.git`](vscode://vscode.git/clone?url=https://github.com/microsoft/vscode.git)

## Open a project or file

> Ref: [Opening VS Code with URLs - VSCode Documentation](https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls)

- Open a project
    - `vscode://file/{full-path-to-project}/`
    - e.g. [`vscode://file/c:/myProject/`](vscode://file/c:/myProject/)
- Open a file
    - `vscode://file/{full-path-to-file}`
    - e.g. [`vscode://file/c:/myProject/package.json`](vscode://file/c:/myProject/package.json)
- Open a file to line and column
    - `vscode://file/{full-path-to-file}:{line}:{column}`
    - e.g. [`vscode://file/c:/myProject/package.json:5:10`](vscode://file/c:/myProject/package.json:5:10)

## Open settings

> Ref: [Opening VS Code with URLs - VSCode Documentation](https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls)

- `vscode://settings/{setting-id}`
- e.g. [`vscode://settings/editor.wordWrap`](vscode://settings/editor.wordWrap)

## Open extensions

> Inspect: Try installing [any extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) from [Visual Studio Marketplace](https://marketplace.visualstudio.com/)

- `vscode:extension/{extension-id}`
- e.g. [`vscode:extension/ms-vscode.cpptools`](vscode:extension/ms-vscode.cpptools)

## Extension registered URIs

> Ref: [What options are available to use with the vscode:// url scheme? - Stack Overflow](https://stackoverflow.com/q/67491505/16468609)

- `vscode://{extension-id}/...`
- e.g. [`vscode://vscode.git/clone?url=https://github.com/microsoft/vscode.git`](vscode://vscode.git/clone?url=https://github.com/microsoft/vscode.git)
