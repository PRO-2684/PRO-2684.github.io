---
title: Dev Containers
tags: [Technical, Latest]
keywords: [VSCode, Visual Studio Code, Dev Containers, Docker]
description: This article provides some techneques to enhance your experience with Dev Containers in Visual Studio Code, including how to build dev containers in background.
---

# Dev Containers

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

Now, you can make a directory named `tools` and create a script named `rebuild.sh` with above command in it. Then, you can run this script in the background, which will keep the build running until it either finishes or fails:

```bash
nohup ./tools/rebuild.sh &
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

To inspect the build logs, you can simply run `tail nohup.out` in the terminal. However, as the output mostly contains JSON, you may want to use `jq` to extract only the text:

```bash
tail nohup.out -n 1 | jq '.text'
```

If you don't have `jq` installed, try out my naive implementation by downloading [`jq.js`](https://github.com/PRO-2684/gadgets/blob/main/naive_jq/jq.js) under `tools` directory. Then, you can run the following command to inspect latest output:

```bash
tail nohup.out -n 1 | node tools/jq.js -p ".text"
```

If `node` is not available, you can replace it with VSCode server's node binary, as mentioned in our `rebuild.sh` script. In my case, the command is:

```bash
tail nohup.out -n 1 | /home/[user]/.vscode-server/cli/servers/Stable-f1a4fb101478ce6ec82fe9627c43efbf9e98c813/server/node tools/jq.js -p ".text"
```
