---
title: 命令行控制 OneDrive 文件随选
tags: [Technical]
keywords: [OneDrive, Attributes, attrib.exe, OneDrive Personal, Sync, Files On-Demand, 文件随选, 同步]
description: 此文章介绍了如何通过命令行控制 OneDrive 的文件随选功能
---

## 💬 前言

最近 Windows Explorer 中 OneDrive 的云文件不显示同步图标了，并且右键菜单里也没有一直保留在电脑和释放空间的选项，网上重置和改注册表的方法也毫无作用。因此，我搜索了通过命令行控制 OneDrive [文件随选](https://support.microsoft.com/zh-cn/office/%E9%80%9A%E8%BF%87%E9%80%82%E7%94%A8%E4%BA%8E-windows-%E7%9A%84-onedrive-%E6%96%87%E4%BB%B6%E9%9A%8F%E9%80%89%E8%8A%82%E7%9C%81%E7%A3%81%E7%9B%98%E7%A9%BA%E9%97%B4-0e6860d3-d9f3-4971-b321-7092438fb38e) ([Files On-Demand](https://support.microsoft.com/en-us/office/save-disk-space-with-onedrive-files-on-demand-for-windows-0e6860d3-d9f3-4971-b321-7092438fb38e)) 的相关文章，发现还真可以用。

## 🛠️ 使用 attrib.exe 修改文件属性

Windows 自带的 attrib.exe 可以用来修改文件和文件夹的属性。具体用法可以通过 `attrib /?` 来查看：

```bash
$ attrib /?
Displays or changes file attributes.

ATTRIB [+R | -R] [+A | -A] [+S | -S] [+H | -H] [+O | -O] [+I | -I] [+X | -X] [+P | -P] [+U | -U]
       [drive:][path][filename] [/S [/D]] [/L]

  +   Sets an attribute.
  -   Clears an attribute.
  R   Read-only file attribute.
  A   Archive file attribute.
  S   System file attribute.
  H   Hidden file attribute.
  O   Offline attribute.
  I   Not content indexed file attribute.
  X   No scrub file attribute.
  V   Integrity attribute.
  P   Pinned attribute.
  U   Unpinned attribute.
  B   SMR Blob attribute.
  [drive:][path][filename]
      Specifies a file or files for attrib to process.
  /S  Processes matching files in the current folder
      and all subfolders.
  /D  Processes folders as well.
  /L  Work on the attributes of the Symbolic Link versus
      the target of the Symbolic Link
```

## ☁️ 修改文件随选状态

通过文档，我们可以发现 OneDrive 使用了下面这些属性来控制文件随选的状态：

| 图标 | 文件状态 | 说明 | 属性 |
| - | - | - | - |
| ![仅联机可用](https://support.microsoft.com/images/zh-cn/3d863da6-6251-4d69-85c9-178f6458fa18) | 仅联机可用 (Cloud-Only) | 打开文件时再下载，不占空间 | U / Unpinned |
| ![本地可用](https://support.microsoft.com/images/zh-cn/36c9b95b-7af8-4d6b-a7c5-4de9572171e4) | 本地可用 (Locally Available) | 下载了的文件，可能会被自动清理，占用空间 | 无 |
| ![始终保留在此设备上](https://support.microsoft.com/images/zh-cn/36c9b95b-7af8-4d6b-a7c5-4de9572171e4) | 会自动下载到设备，不会自动清理，占用空间 | P / Pinned |

另外，经过观察，OneDrive 文件 A 属性总是存在，而 O / Offline 属性表明了文件是否已经下载到本地。若 O 属性存在，则说明文件未下载到本地，打开文件时需要联网下载；若 O 属性不存在，则说明文件已经下载到本地，可以离线访问。

我们可以通过下面的命令来修改文件的属性，从而控制文件随选的状态：

- 将文件设置为“仅联机可用”状态 (会自动删除本地副本，之后设置 O 属性)：
  ```cmd
  attrib +u <path>
  ```
- 将文件设置为“本地可用”状态 (文件暂时保留当前状态，O 属性不变)：
  ```cmd
  attrib -u -p <path>
  ```
- 将文件设置为“始终保留在此设备上”状态 (会自动下载文件，之后清除 O 属性)：
  ```cmd
  attrib +p <path>
  ```

若省略路径，则会修改当前目录下所有文件的属性。另外，测试后发现无法通过手动设置 O 属性实现空间释放或文件下载，可以考虑：

- 释放空间：先设置 U 属性
- 下载文件：先设置 P 属性

等文件操作完成后，再根据需要调整相关属性。

## 🎉 致谢

- [Configure OneDrive Files On-Demand states using PowerShell](https://tech.tristantyson.com/setonedrivefodstatespowershell)
- [Query and set Files On-Demand states in Windows](https://learn.microsoft.com/en-us/sharepoint/files-on-demand-windows)
