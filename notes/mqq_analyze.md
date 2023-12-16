---
title: 手机 QQ 自动下载分析
tags: [Technical, Latest]
keywords: [QQ, Mobile, 自动下载, 分析]
description: Test
scripts: false
---

# 手机 QQ 自动下载分析

## 起因

最近，QQ 群内开始流传一张二维码，据说用安卓 QQ 扫了它就会开始自动下载~~原神~~《元梦之星》这款游戏。~~这种乐子怎么能少得了我呢？~~

![可疑二维码](@attachment/sus_qr.jpg =128x*)

经群 u 测试，复现成功。

![复现](@attachment/replicating.jpg)

## 分析

### 自动下载

第一步当然是识别二维码了，随便找个软件扫一下，得到网址 `https://ymzx.qq.com/zlkdatasys/mct/d/play.shtml`，看来是官方推广。电脑上打开，就是游戏下载页面，大概是是做了判断，如果是手机 QQ 内置浏览器打开，就直接下载游戏。接下来我们查看 HTML 元素：

![源码 1](@attachment/mqq_src1.jpg)

经分析，图示五个 `<script>` 的作用分别是：

- `ping_tcss_tgideas_https_min.js`：遥测，记录用户行为
- `qqapi.wk.js`：最小化的 QQ API 库，提供了一些与手机 QQ 互动的接口
- `1112198072.js`：下载链接等配置信息
- 内联脚本：下载链接等配置信息
- `play.v3.js`：主逻辑，根据平台进行对应的操作

那么我们重点关注近 1000 行的 `play.v3.js`。幸运的是，它没有被压缩或混淆，甚至还保留了注释，我们可以很方便地进行断点分析。粗略查看后，此代码逻辑是检查是否安装了 `com.tencent.letsgo` (《元梦之星》包名)，安装了则启动，否则下载。但是我们并未发现类似调用 QQ API 下载软件的代码，它的逻辑是直接跳转到下载链接：

```javascript
var uniformDownload = function (options) {
    // ...
    if (options.download) {
        //是否自定义了下载方式
        options.download(options);
    } else {
        if (pf == "pc_browser") {
            window.open(options.url); //打开新窗口
        } else {
            window.location.href = options.url;
        }
    }
    // ...
}
```

当平台为安卓时，所有调用此函数的地方均未指定 `download` 参数。经测试，我们可以通过直接访问 APK 直链来触发自动下载，可以合理推测 QQ 的内置浏览器会接管所有它自家的 APK 下载。

至此我们的主要任务已经告一段落了（自动下载的逻辑就是打开下载直链，QQ 就会接管后开始下载），但是这个脚本里还有两个值得研究的方向：一是它有对 URL 参数的判断，二是它有用 `mqq` API 来实现软件是否安装的判断。

### `mqq` API

`play.v3.js` 中用了一些定义在 `qqapi.wk.js` 中的 `mqq` API，以下是使用的 API 列表以及我的推测：

- `.app`
    - `.isAppInstalled(package: String, callback)`
        - 是否安装指定包名软件
        - `package`: 包名
        - `callback`: `(result: Boolean) => {...}`
    - `.launchApp(package: String, arg)`
        - 启动软件
        - `package`: 包名
        - `args`: JSON 数据或者 `false`，暂时不清楚作用，可能是启动参数
- `.device`
    - `.isMobileQQ(callback)`
        - 检查平台是否为手机 QQ
        - `callback`: `(result: Boolean) => {...}`
- `.ui`
    - `.pageVisibility(callback)`
        - 检查当前页面是否可见
        - `callback`: `(result: Boolean) => {...}`

`qqapi.wk.js` 还定义了更多的 API，这里就不一一列举了，感兴趣的可以加载这个库后自行查看 `window.mqq` 对象。

看到这，我知道你在想什么：如果我们自己搭建的网站也加载了这个库，是不是就可以调用这些 API 了？答案是否定的，因为 QQ 貌似做了网址判断，不是它自己的就会提示 `Permission denied`。为了测试这一点，我做了一个 [简单的 POC](@note/mqq_test)，用于检测是否安装了微信，主要逻辑如下：

```javascript
alert("Lib loaded");
const api = window?.mqq?.app;
if (!api) {
    alert("mqq not found!");
    return;
}
api.isAppInstalled("com.tencent.mm", (result) => { alert("WeChat installed: " + result); });
```

在手机 QQ 内打开，会提示 `WeChat installed: Permission denied`，验证了之前所述；在其它软件打开，则会忽略请求：

![POC result](@attachment/poc_result.png =512x*)

### URL 参数

`play.v3.js` 中有这样一段代码：

```javascript
function getUrlParam(param) {
    var m = new RegExp("(?:&|/?)" + param + "=([^&$]+)").exec(
        window.location.search
    );
    return m ? m[1] : "";
}
```

它会从 URL 中获取参数。上一节中我们知道了 QQ 会做来源判断，从而使得我们的恶意计划泡汤；那么我们是否有可能通过控制 URL 参数，来使 QQ 产生意外的行为呢？我们查找所有调用 `getUrlParam` 的地方：

```javascript
if (getUrlParam("turn_off_lowercase").toLowerCase() != "true") {
    //不关闭小写
    var isBack = getUrlParam("back").toLowerCase(); //下载完成的返回地址,默认返回官网首页
} else {
    var isBack = getUrlParam("back"); //下载完成的返回地址,默认返回官网首页
}
var TGMediaId = getUrlParam("media") ? getUrlParam("media") : 0; //url传过来的渠道id
var deviceType = getUrlParam("device").toLowerCase(), //指定系统，直接下载，不拉起，auto为自动识别当前手机系统下载。
    homePageJump = getUrlParam("jump").toLowerCase(), //是否在拉起/下载后跳转到“跳转页”
    otherBrowser = getUrlParam("browser").toLowerCase(), //第三方浏览器是否启用拉起，auto启用
    mqqParams = getUrlParam("mqq").toLowerCase(); //手Q参数， select代表出现两个选择按钮
// 旧参数，未来弃用20210714 S
var iosSchemeParameter = getUrlParam("ios_scheme_parameter"), //iOS网页拉起，Scheme 参数
    androidSchemeParameter = getUrlParam("android_scheme_parameter"), //Android网页拉起， Scheme 参数
    iosWechatAppIdParameter = getUrlParam("ios_wechat_appid_parameter"), //ios下微信通过appid拉起游戏时传递给第三方app的参数
    androidWechatAppIdParameter = getUrlParam("android_wechat_appid_parameter"); //android下微信通过appid拉起游戏时传递给第三方app的参数
iosmqqp = getUrlParam("iosmqqp"); //iOS下手Q拉起传递给第三方app的参数
// 旧参数，未来弃用20210714 E
var _launch = getUrlParam("launch"), //全局拉起参数
    IWL = getUrlParam("IWL"), //iOS微信拉起参数
    IQL = getUrlParam("IQL"), //iOS QQ拉起参数
    IBL = getUrlParam("IBL"), //iOS浏览器拉起参数
    AWL = getUrlParam("AWL"), //Android微信拉起参数
    AQL = getUrlParam("AQL"), //Android QQ拉起参数
    ABL = getUrlParam("ABL"); //Android浏览器拉起参数
var jumpToHome = getUrlParam("jumpToHome"); //跳转首页相关参数
var noDownloadAlert = getUrlParam("noDownloadAlert"); //禁止弹出下载内容alert
var source = function () {
    //统计来源
    var from = getUrlParam("from");
    if (from) {
        PTTSendClick("from", from, "来源" + from);
    }
};
```

粗略分析后发现我们能做的有意义的事：

- 控制下载完成后是否跳转以及跳转地址
- 控制游戏启动参数

基本上不能通过 URL 参数来达成恶意攻击的目的。

## 总结

- QQ 内置浏览器会接管所有它自家的 APK 下载，二维码给出的链接会自动打开下载直链导致了自动下载，这并非漏洞
- QQ 内置浏览器会拦截非自家网址的 `mqq` API 调用
- 可以通过 URL 参数来控制游戏启动参数，但是未发现通过 URL 参数来达成恶意攻击的方法

## 花絮

### 梗图版本更新

![Meme 1](@attachment/meme1.jpg =40%x*) ![Meme 2](@attachment/meme2.jpg =40%x*)

### 存档

为了避免可能的页面删除或修改，准备将其在 [Wayback Machine](https://web.archive.org/) 上存档，没想到的是有人已经捷足先登了：

![存档](@attachment/web_archive.jpg)

### 赛博商战

![赛博商战](@attachment/shit_vs_shit.jpg =512x*)
