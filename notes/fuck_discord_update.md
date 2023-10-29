---
title: 禁止 Discord 自动更新
tags: [Technical, Latest]
keywords: [Discord, 自动更新, Auto update, Windows]
description: 此文介绍了一种完全禁止 Discord 自动更新的方法
---

# 禁止 Discord 自动更新

## 修改快捷方式 (Win)

- 右键 - 属性 - 快捷方式，记下 Discord 安装路径 `.../Discord/`
- 打开此目录，进入 `app-<version>` 目录，其中 `<version>` 为版本号
- 右键 `Discord.exe` - 发送到桌面快捷方式

## 修改代码 (理论通用)

- 删除 `.../Discord/Update(.exe)`
- 找到安装目录
- 打开 `Discord/app-<version>/resources/` 目录
- 备份 `Discord/app-<version>/resources/app.asar`
- 使用 Node 的 asar 工具解包它
  - 若没有 Node 并且不想安装，可以去[这个 repo](https://github.com/async3619/asar-exec/releases) 下载预编译的独立 asar 工具
  - 参考命令：`.\asar.exe e .\app.asar discord`
- 修改解包出来的文件夹下 `app_bootstrap/splashScreen.js`
  - 将原先的：
    ```js
    async function updateUntilCurrent() {
      const retryOptions = {
        skip_host_delta: false,
        skip_module_delta: {}
      };
    ```
  - 后面添加：
    ```js
      // HACK
      await newUpdater.startCurrentVersion();
      newUpdater.setRunningInBackground();
      newUpdater.collectGarbage();
      launchMainWindow();
      updateBackoff.succeed();
      updateSplashState(LAUNCHING);
      return;
    ```
  - 从而得到类似于：
    ```js
    async function updateUntilCurrent() {
      const retryOptions = {
        skip_host_delta: false,
        skip_module_delta: {}
      };

      // HACK
      await newUpdater.startCurrentVersion();
      newUpdater.setRunningInBackground();
      newUpdater.collectGarbage();
      launchMainWindow();
      updateBackoff.succeed();
      updateSplashState(LAUNCHING);
      return;

      while (true) {
        updateSplashState(CHECKING_FOR_UPDATES);
        try {
    ```
  - 这里：
    ```js
    function initOldUpdater() {
      modulesListeners = {};
      addModulesListener(CHECKING_FOR_UPDATES, () => {
        console.log(`splashScreen: ${CHECKING_FOR_UPDATES}`);
        startUpdateTimeout();
        updateSplashState(CHECKING_FOR_UPDATES);
      });
    ```
  - 改为：
    ```js
    function initOldUpdater() {
      modulesListeners = {};
      addModulesListener(CHECKING_FOR_UPDATES, () => {
        console.log(`splashScreen: ${CHECKING_FOR_UPDATES}`);

        // HACK
        console.log("Skipping update check for you...");
        moduleUpdater.setInBackground();
        launchMainWindow();
        updateSplashState(LAUNCHING);

        // startUpdateTimeout();
        updateSplashState(CHECKING_FOR_UPDATES);
      });
    ```
  - 样例文件可参考 [splashScreen_original.js](@attachment/splashScreen_original.js), [splashScreen_patched.js](@attachment/splashScreen_patched.js)
- 重新打包 `app.asar`，参考命令 `.\asar.exe p .\discord\ app.asar`
- 新得到的 `app.asar` 覆盖 `Discord/app-<version>/resources/app.asar`
