---
title: VSCode 内根据后缀名自动选择对应编译任务
tags: [Technical]
keywords: [VSC, VSCode, C, C++, gcc, g++, tasks.json]
description: 通过配置 tasks.json，实现 VSCode 内根据后缀名自动选择对应编译任务。例如根据是 C 还是 C++ 文件，自动选择 gcc 还是 g++ 编译。
---

# VSCode 内根据后缀名自动选择对应编译任务

## 结论

以 Windows 下为例，给出一个可以用的 tasks.json 配置文件，从而根据后缀名自动选择对应编译任务 (gcc/g++)。其中的 `<path_to_gcc>` 和 `<path_to_g++>` 需要替换为你的 gcc.exe 和 g++.exe 的路径。

```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "cppbuild",
			"label": "C/C++: gcc.exe 生成活动文件",
			"command": "<path_to_gcc>",
			"args": [
				"-std=c99",
				"-fexec-charset=GBK",
				"-g",
				"${file}",
				"-o",
				"${fileDirname}\\${fileBasenameNoExtension}.exe",
				"-O2"
			],
			"options": {
				"cwd": "${fileDirname}"
			},
			"problemMatcher": [
				"$gcc"
			],
			"group": {
				"kind": "build",
				"isDefault": "**.c"
			},
			"detail": "编译器: <path_to_gcc>"
		},
		{
			"type": "cppbuild",
			"label": "C/C++: g++.exe 生成活动文件",
			"command": "<path_to_g++>",
			"args": [
				"-fexec-charset=GBK",
				"-g",
				"${file}",
				"-o",
				"${fileDirname}\\${fileBasenameNoExtension}.exe",
				"-O2"
			],
			"options": {
				"cwd": "${fileDirname}"
			},
			"problemMatcher": [
				"$gcc"
			],
			"group": {
				"kind": "build",
				"isDefault": "**.cpp"
			},
			"detail": "编译器: <path_to_g++>"
		}
	]
}
```

`"isDefault": "**.c"` 和 `"isDefault": "**.cpp"` 用于指定特定后缀名的默认编译任务。若没有这两行，则需每次编译时手动选择编译任务。实际上这是通过正则表达式匹配的，所以你也可以匹配任意其他规则，只是后缀名匹配更为常用。

## 解决过程

1. Bing: `vscode build task based on extension`
2. [Ability to set default tasks based on file extension](https://github.com/microsoft/vscode/issues/88106#issuecomment-1019391116)
3. [Enable globs on tasks otherwise fallback to default](https://github.com/microsoft/vscode/pull/141230#issue-1111741954)
4. 查看 v1.68 的 [release notes](https://code.visualstudio.com/updates/v1_68#_tasks) 中 Tasks 这一项，发现确实添加到 VSCode 中了。
5. 照葫芦画瓢，写出了上面的配置文件，测试通过。
