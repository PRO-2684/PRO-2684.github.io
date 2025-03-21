---
title: Dev Containers
tags: [Technical, Latest]
keywords: [VSC, VSCode, Visual Studio Code, Dev Containers, Docker, 开发容器]
description: 此文章提供了一些技巧来提升 Visual Studio Code 中开发容器的体验，包括如何在后台构建开发容器。This article provides some techneques to enhance your experience with Dev Containers in Visual Studio Code, including how to build dev containers in background.
---

# Dev Containers

[English Version](#introduction)

## 简介

开发容器是 Visual Studio Code 中的一个功能，允许你在容器化的环境中进行开发。这对于确保你的开发环境在不同的机器上保持一致，以及将你的开发环境与主机机器隔离开来非常有用。请注意，以下内容假定你**已经熟悉开发容器**。

## 后台构建

### 问题

当你重新打开一个文件夹时，Visual Studio Code 会在前台构建容器，这可能会很慢。并且如果你关闭窗口，构建将会停止，而且 [目前没有办法实现持久的 SSH 会话](https://github.com/microsoft/vscode-remote-release/issues/3096) 来保持构建工作在后台运行。

### 解决方案

为了解决这个问题，我们首先需要找到一种方法来在命令行中触发构建过程。这可以通过检查开发容器的日志来完成，只需在触发 "Reopen in Container" 命令后点击 "show log" 的提示即可：

![dev-containers-toast](/attachments/dev-containers-toast.jpg)

然后，在日志中搜索 `Start: Checking for Dev Containers CLI`，我们需要的命令就在它的下面：

![dev-containers-log](/attachments/dev-containers-log.jpg)

对我而言，命令是：

```bash
/home/[user]/.vscode-server/cli/servers/Stable-f1a4fb101478ce6ec82fe9627c43efbf9e98c813/server/node /home/[user]/.vscode-remote-containers/dist/dev-containers-cli-0.388.0/dist/spec-node/devContainersSpecCLI.js up --container-session-data-folder /tmp/devcontainers-71e153df-e6c9-4bed-bf46-1d62da4b591c1732006861874 --workspace-folder /home/[user]/[folder] --workspace-mount-consistency cached --gpu-availability detect --id-label devcontainer.local_folder=/home/[user]/[folder] --id-label devcontainer.config_file=/home/[user]/[folder]/.devcontainer/devcontainer.json --log-level debug --log-format json --config /home/[user]/[folder]/.devcontainer/devcontainer.json --default-user-env-probe loginInteractiveShell --mount type=volume,source=vscode,target=/vscode,external=true --skip-post-create --update-remote-user-uid-default on --mount-workspace-git-root --include-configuration --include-merged-configuration
```

主要结构为 `.../node .../devContainersSpecCLI.js up ...`。为了便于查看日志，我们将 `--log-format json` 替换为 `--log-format text`。若 `postCreateCommand` 耗时较长，可以移除 `--skip-post-create` 参数。

现在，你可以将修改后的命令保存在 `rebuild.sh`。然后，你可以像这样在后台运行这个脚本，这将保持构建工作的运行，直到它完成或失败：

```bash
nohup ./rebuild.sh &
```

然而，需要注意的是：

- 上面的命令是针对特定环境的，仅用于演示目的。
- 之前生成的开发容器镜像不会自动删除，所以你可能需要手动删除它们以节省磁盘空间。

### 检查构建进程

只需运行：

```bash
ps -x | grep rebuild.sh
```

### 检查构建日志

要检查构建日志，你只需在终端中运行 `tail nohup.out`。

## Introduction

Dev Containers is a feature in Visual Studio Code that allows you to develop in a containerized environment. This is useful for ensuring that your development environment is consistent across different machines and for isolating your development environment from your host machine. Note that following content is written with the assumption that you are **already familiar with Dev Containers**.

## Build in Background

### Problem

When you re-open a folder in a Dev Container, Visual Studio Code will build the container in the foreground, which can be slow. What's more, the build will stop if you closes the window, and [there's currently no way for persistent SSH session](https://github.com/microsoft/vscode-remote-release/issues/3096) to keep the build running in the background.

### Solution

To work around this, we first need a way to trigger the building process on the command line. This can be done by inspecting logs of Dev Container, as simple as clicking that "show log" toast after you trigger "Reopen in Container" command:

![dev-containers-toast](/attachments/dev-containers-toast.jpg)

Then, search for `Start: Checking for Dev Containers CLI` in the log, and the command we need is right below it:

![dev-containers-log](/attachments/dev-containers-log.jpg)

In my case, the command is:

```bash
/home/[user]/.vscode-server/cli/servers/Stable-f1a4fb101478ce6ec82fe9627c43efbf9e98c813/server/node /home/[user]/.vscode-remote-containers/dist/dev-containers-cli-0.388.0/dist/spec-node/devContainersSpecCLI.js up --container-session-data-folder /tmp/devcontainers-71e153df-e6c9-4bed-bf46-1d62da4b591c1732006861874 --workspace-folder /home/[user]/[folder] --workspace-mount-consistency cached --gpu-availability detect --id-label devcontainer.local_folder=/home/[user]/[folder] --id-label devcontainer.config_file=/home/[user]/[folder]/.devcontainer/devcontainer.json --log-level debug --log-format json --config /home/[user]/[folder]/.devcontainer/devcontainer.json --default-user-env-probe loginInteractiveShell --mount type=volume,source=vscode,target=/vscode,external=true --skip-post-create --update-remote-user-uid-default on --mount-workspace-git-root --include-configuration --include-merged-configuration
```

The main structure is `.../node .../devContainersSpecCLI.js up ...`. To make logs easier to read, we replace `--log-format json` with `--log-format text`. If `postCreateCommand` takes a long time, you can remove `--skip-post-create` parameter.

Now, you can create a script named `rebuild.sh` with our modified command in it. Then, you can run this script in the background, which will keep the build running until it either finishes or fails:

```bash
nohup ./rebuild.sh &
```

However, do note that:

- The command above is environment-specific, and only used for demonstration purpose.
- Previously generated images of dev containers won't be removed automatically, so you may want to remove them manually to save disk space.

### Inspect Build Process

Simply run:

```bash
ps -x | grep rebuild.sh
```

### Inspect Build Logs

To inspect the build logs, you can simply run `tail nohup.out` in the terminal.
