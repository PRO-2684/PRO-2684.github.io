---
title: DLNA 捕获
tags: [Technical, Latest, Rust]
keywords: [DLNA, capture, 捕获, Windows, Media, DMR]
description: 此文介绍了如何在 Windows 下利用系统自带的 Windows Media Player 捕获 DLNA 投屏的媒体流网址，DLNA 的基本原理，以及如何编写一个程序实现捕获的自动化
---

# DLNA 捕获

## 前言

众所周知，众多流媒体平台不再提供网页端的服务，只能在 APP 内看视频，而这就在一定程度上妨碍了我们抓包、获取网址、下载视频的工作流。为了让用户能够在智能电视上看视频，这些平台又往往会提供一个投屏到电视的选项。

虽然大家都约定俗成地说是“投屏”，但实际上这个称呼是有歧义的，既可以指“将屏幕镜像到另一个设备”，也可以指“将某媒体流投送到另一个设备”。前者需要在局域网内实时传输画面，而后者往往只需要将一个网址传输给目标设备。这里我们仅针对第二种情况展开讨论。

## Windows Media Player

既然电视上能够播放投屏的媒体流，那么理论上我们可以用电脑模拟成一个电视，让电脑接收媒体流的网址。如果我们能够得到这个网址，那么下载媒体也就不在话下了。经过一番搜索，我发现 Windows Media Player 可以接受媒体流推送，那么让我们尝试利用它来获取媒体流网址。

### 启用媒体流

首先打开控制面板，进入“网络共享中心”，点击左侧栏的“媒体流式处理选项”：

![媒体流式处理选项](/attachments/control_media_stream.jpg)

然后单击“启用媒体流”按钮：

![启用媒体流](/attachments/control_enable_media_stream.png)

<details><summary>“媒体流未启用”？</summary>

若出现下图所示“媒体流未启用”的提示：

![媒体流未启用](/attachments/control_media_stream_disabled.png)

那么点击下方的“Windows 服务管理工具”，然后找到“Windows Media Player Network Sharing Service”服务：

![“Windows Media Player Network Sharing Service”服务](/attachments/service_wmp.png)

右键，选择“属性”，将其启动类型设置为“自动”或者“自动（延迟启动）”，点击“应用”后再次点击“启动”：

![“Windows Media Player Network Sharing Service”服务属性设置](/attachments/service_wmp_prop.png)

若提示下述信息：

```text
Windows 无法启用 Windows Media Player Network Sharing Service 服务 (位于 本地计算机 上)
错误 1068: 依赖服务或组无法启动。
```

则先用同样方法启动“依存关系”中的五个服务 ([ref](https://answers.microsoft.com/zh-hans/windows/forum/all/windows%E6%97%A0%E6%B3%95%E5%90%AF%E7%94%A8windows/2a007912-941f-4470-9e7e-9b0627123edc))：

![依存关系](/attachments/service_dependencies.png)

- Windows Search
- Background Tasks Infrastructure Service
- Remote Procedure Call (RPC)
- DCOM Server Process Launcher
- RPC Endpoint Mapper

启动成功后即可关闭“服务”窗口，然后 **重新进入** 控制面板的“媒体流选项”。

</details>

随后，在所有网络中允许访问共享媒体：

![允许访问共享媒体](/attachments/control_allow_accessing_media.png)

完成上述步骤后即可关闭控制面板。

### 允许远程控制我的播放器

打开 Windows Media Player (找不到可以搜索) 软件，在“媒体流”选项中勾选“允许远程控制我的播放器”：

![允许远程控制我的播放器](/attachments/wmp_legacy_allow_remote_control.png)

注意，这一步之后不能关闭 Windows Media Player，否则会导致后续找不到设备。

### 开始投屏

将手机或其他设备连接到同一局域网，打开一个支持 DLNA 的 APP (如哔哩哔哩)，并打开任意视频 (例如 [BV1GJ411x7h7](https://b23.tv/BV1GJ411x7h7))，在播放界面点击投屏按钮，选择你的电脑：

![哔哩哔哩投屏](/attachments/bilibili_screencast.jpg)

如果一切正常，Windows Media Player 就会开始播放此视频：

![Windows Media Player 播放](/attachments/wmp_legacy_playing.png)

### 查看网址

右键画面，点击“显示播放列表”：

![显示播放列表](/attachments/wmp_legacy_show_playlist.png)

随后在播放列表中找到刚才投屏的视频，右键点击，选择“属性”：

![播放列表属性](/attachments/wmp_legacy_playlist_properties.png)

在弹出的属性窗口中的“文件”选项卡中即可看到视频的 URL，使用鼠标从头到尾选中后即可复制：

![播放列表属性 URL](/attachments/wmp_legacy_playlist_url.png)

随后可以将此 URL 粘贴到浏览器或下载工具中进行下载。

## DLNA 协议

显然，上面的方法还是太吃操作了，那么有没有更自动化的方式呢？答案是有的，但需要编写一个程序扮演 DLNA DMR (Digital Media Renderer) 的角色，自动接收媒体流并提取 URL。首先，我们简单介绍一下 DLNA 协议：

> **Digital Living Network Alliance** (**DLNA**) is a set of interoperability standards for sharing home digital media among multimedia devices.

这个标准主要包括下面五个角色：

- Digital Media Server (DMS): 数位媒体伺服器，存储并提供媒体文件。
- Digital Media Renderer (DMR): 数位媒体渲染器，可接收并播放从 DMC 推送过来的媒体档案。(接收并执行 DMC 发送的指令)
- Digital Media Controller (DMC): 数位媒体控制器，作为遥控装置使用，可寻找 DMS 上的多媒体档案，并指定可播放该多媒体档案的 DMR 进行播放或是控制多媒体档案上下传到 DMS 的装置。
- Digital Media Player (DMP): 数位媒体播放器，寻找并播放或输出 DMS 所提供的媒体文件。(DMP≈DMR+DMC)
- Digital Media Printer (DMPr): 数位媒体印表机，可以在 DLNA 网路架构下提供列印功能。

在使用哔哩哔哩软件投屏至电视的场景下，哔哩哔哩公司的服务器就是 DMS，手机上的哔哩哔哩软件即为 DMC，而智能电视就是 DMR。因此，为了达成“DLNA 捕获”的目的，我们需要解决两个关键问题：

1. 告知 DMC：“我是 DMR，我可以接受媒体流然后渲染”
2. 接收发给自己的控制指令，然后输出指令的内容，从而获得网址
    - 由于我们做的是假 DMR (dummy DMR)，因此不需要实现指令的执行

DMR 实际上由两个服务器构成：一个是 SSDP 服务器，负责通过 [SSDP 协议](https://www.wikiwand.com/en/articles/Simple_Service_Discovery_Protocol) 控制设备的发现、更改与离开；一个是 HTTP 服务器，负责托管各种描述文件，以及指令的接收和结果的返回。

## SSDP

**Simple Service Discovery Protocol** (**SSDP**) 是基于文本的协议。除了它使用 UDP 外，其它方面，例如报文结构，和 HTTP 不能说十分相似，只能说一模一样。例如，一个经典的广播消息可以长这样：

```http
NOTIFY * HTTP/1.1
Host: 239.255.255.250:1900
NT: upnp:rootdevice
NTS: ssdp:alive
Location: http://192.168.14.122:2869/upnphost/udhisapi.dll?content=uuid:04f976f9-14d8-4205-a6c4-950dad87c430
USN: uuid:04f976f9-14d8-4205-a6c4-950dad87c430::upnp:rootdevice
Cache-Control: max-age=1800
Server: Microsoft-Windows/10.0 UPnP/1.0 UPnP-Device-Host/1.0
```

通过 SSDP 告知自己是 DMC 主要有两种途径：

| 途径  | HTTP Method (?)  | 主/被动 | 备注                          |
| --- | ---------------- | ---- | --------------------------- |
| 广播  | `NOTIFY`         | 主动   | 向所有设备广播自己的状态 (`ssdp:alive`) |
| 应答  | 对 `M-SEARCH` 的应答 | 被动   | 当有设备寻找 DMR 时，向其发送应答         |

### 广播

简单来说，广播的主要是下面这些信息：

- 通知类型 (`NT`, Notification Type)
- 通知子类 (`NTS`, Notification Sub Type)
- 唯一服务名 (`USN`, Unique Service Name)
- 设备描述所在地址 (`Location`)

DMR 实际上注册了多个服务，同时还需要告知自己的角色等信息，而这些都是分开广播的，因此需要广播多次。对于设备描述所在地址 (`Location`)，你猜的没错，这个文件就是需要 HTTP 服务器 host 的。

### 应答

一个典型的 `M-SEARCH` 消息可以长这样：

```http
M-SEARCH * HTTP/1.1
MX: 1
ST: upnp:rootdevice
MAN: "ssdp:discover"
User-Agent: Linux/3.0.0 UPnP/1.0 Platinum/1.0.5.13
Connection: close
Host: 239.255.255.250:1900
```

既然我们做的是 dummy DMR，可以偷个懒 - 只要看到 `M-SEARCH` 消息就回应，而不必处理它的搜索目标是不是我们的 DMR，因此此处不展开。对上述搜索消息的回应是：

```http
HTTP/1.1 200 OK
ST: upnp:rootdevice
USN: uuid:04f976f9-14d8-4205-a6c4-950dad87c430::upnp:rootdevice
Location: http://192.168.14.122:2869/upnphost/udhisapi.dll?content=uuid:04f976f9-14d8-4205-a6c4-950dad87c430
Cache-Control: max-age=1800
Server: Microsoft-Windows/10.0 UPnP/1.0 UPnP-Device-Host/1.0
Ext:
Date: Wed, 28 May 2025 03:51:18 GMT
```

## HTTP

因为 Windows Media Player 的网址路由难以理解，接下来我将使用我定义的路由进行讲解。最关键的主要有以下三个路由：

- `/DeviceSpec`: 设备描述路由
- `/AVTransport`: `AVTransport` 服务路由
- `/RenderingControl`: `RenderingControl` 服务路由

### DeviceSpec

这个路由只接受 `GET` 方法，返回设备描述文件。设备描述文件用 XML 定义，主要包含设备类型、名称、制造商、序列号、UUID 以及包含的服务等信息。下面的两个路由都是从这里定义的。[示例设备描述文件模板](https://github.com/PRO-2684/dlna-dmr/blob/c0f8c6f2b8c13c270fa7f12e8199b3a86459df68/src/template/DeviceSpec.tmpl.xml)。

### AVTransport

这个路由在 `GET` 方法下返回 `AVTransport` 服务的服务描述文件，在 `POST` 方法下调用此服务的某个动作。主要包括查询更改播放内容、播放进度、循环模式，开始、暂停、停止播放等动作。[示例 AVTransport 服务描述文件](https://github.com/PRO-2684/dlna-dmr/blob/c0f8c6f2b8c13c270fa7f12e8199b3a86459df68/src/template/AVTransport.xml)。一个示例 POST 请求体如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Body>
        <u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">
            <InstanceID>0</InstanceID>
            <CurrentURI>http://example.com/sample.mp4?param1=a&amp;param2=b</CurrentURI>
            <CurrentURIMetaData/>
        </u:SetAVTransportURI>
    </s:Body>
</s:Envelope>
```

它就是调用了 `AVTransport` 的 `SetAVTransportURI`，其中参数 `InstanceID` 为 `0`，参数 `CurrentURI` 为 `http://example.com/sample.mp4?param1=a&param2=b` (注意解码)，参数 `CurrentURIMetaData` 为空。意思就是设置播放的网址为 `http://example.com/sample.mp4?param1=a&param2=b`。

### RenderingControl

与 `AVTransport` 类似，这个路由在 `GET` 方法下返回 `RenderingControl` 服务的服务描述文件，在 `POST` 方法下调用此服务的某个动作。主要包括查询更改静音、音量等动作。[示例 RenderingControl 服务描述文件](https://github.com/PRO-2684/dlna-dmr/blob/c0f8c6f2b8c13c270fa7f12e8199b3a86459df68/src/template/RenderingControl.xml)。

## 代码实现

### Python POC

最后，将上述内容结合起来，我们可以用 Python 做一个最小的 dummy DMR，用于验证我们的猜想：

```python
import socket
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import uuid
from datetime import datetime, timezone

# Configuration - Protocol and Network
IP = socket.gethostbyname(socket.gethostname())
SSDP_PORT = 1900
HTTP_PORT = 8000

# Configuration - Device Information
FRIENDLY_NAME = "Dummy Renderer"
MODEL_NAME = "Dummy Model"
MODEL_DESCRIPTION = "A dummy UPnP renderer for testing purposes"
MODEL_URL = "http://dummy-renderer.com/model"
MANUFACTURER = "Dummy Manufacturer"
MANUFACTURER_URL = "http://dummy-manufacturer.com"
SERIAL_NUMBER = "12345678-1234-5678-1234-567812345678"
UUID = str(uuid.uuid5(uuid.NAMESPACE_URL, 'DummyRenderer'))

# Constants
SSDP_IP = "239.255.255.250"
SSDP_HOST = "239.255.255.250:1900"
SERVER_NAME = "DummyRenderer/1.0 UPnP/1.0 UPnP-Device-Host/1.0"

# XMLs
with open("./xml/DeviceSpec.tmpl.xml", "r") as f:
    DEVICE_SPEC_XML = f.read() \
        .replace("{{friendlyName}}", FRIENDLY_NAME) \
        .replace("{{modelName}}", MODEL_NAME) \
        .replace("{{modelDescription}}", MODEL_DESCRIPTION) \
        .replace("{{modelURL}}", MODEL_URL) \
        .replace("{{manufacturer}}", MANUFACTURER) \
        .replace("{{manufacturerURL}}", MANUFACTURER_URL) \
        .replace("{{serialNumber}}", SERIAL_NUMBER) \
        .replace("{{uuid}}", UUID) \
        .encode('utf-8')
with open("./xml/RenderingControl.xml", "rb") as f:
    RENDERING_CONTROL_XML = f.read()
with open("./xml/AVTransport.xml", "rb") as f:
    AV_TRANSPORT_XML = f.read()

def gmt_time():
    """Return the current time in GMT format."""
    return datetime.now(timezone.utc).strftime('%a, %d %b %Y %H:%M:%S GMT')

class SSDPServer(threading.Thread):
    def __init__(self):
        super().__init__()
        self.daemon = True
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # Create a UDP socket
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) # Allow reuse of the address
        self.sock.bind(('', SSDP_PORT)) # Bind to all interfaces on SSDP_PORT
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1) # Allow receiving broadcast messages
        self.sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, socket.inet_aton(SSDP_IP) + socket.inet_aton(IP)) # Join the multicast group

    def _notify(self, nt: str, nts: str, usn: str):
        """Send a SSDP notify message with given Notification Type, Notification Sub Type and Unique Service Name.

        Parameters:

        - nt: Notification Type (NT)
        - nts: Notification Sub Type (NTS)
        - usn: Unique Service Name (USN)
        """
        message = (
            "NOTIFY * HTTP/1.1\r\n"
            f"HOST: {SSDP_HOST}\r\n"
            f"NT: {nt}\r\n"
            f"NTS: {nts}\r\n"
            f"USN: {usn}\r\n"
            f"Location: http://{IP}:{HTTP_PORT}/dummy-renderer/DeviceSpec\r\n"
            "Cache-Control: max-age=1800\r\n"
            f"Server: {SERVER_NAME}\r\n"
            'OPT:"http://schemas.upnp.org/upnp/1/0/"; ns=01\r\n'
            "\r\n"
        )
        self.sock.sendto(message.encode('utf-8'), (SSDP_IP, SSDP_PORT))

    def _notify_service(self, service: str, nts: str):
        """Broadcast a notify message for given `service` with given Notification Sub Type.

        Parameters:

        - service: The UPnP service name (e.g., "RenderingControl", "AVTransport", "ConnectionManager")
        - nts: Notification Sub Type (NTS)
        """
        self._notify(
            nt=f"urn:schemas-upnp-org:service:{service}:1",
            nts=nts,
            usn=f"uuid:{UUID}::urn:schemas-upnp-org:service:{service}:1",
        )

    def _notify_all(self, nts: str):
        """Broadcast multiple relevant notify messages with given Notification Sub Type.

        Parameters:

        - nts: Notification Sub Type (NTS)
        """
        self._notify(
            nt="upnp:rootdevice",
            nts=nts,
            usn=f"uuid:{UUID}::upnp:rootdevice",
        )
        self._notify(
            nt=f"uuid:{UUID}",
            nts=nts,
            usn=f"uuid:{UUID}",
        )
        for service in ["RenderingControl", "AVTransport", "ConnectionManager"]:
            self._notify_service(service, nts=nts)

    def alive(self):
        """Broadcast multiple relevant `ssdp:alive` messages."""
        self._notify_all(nts="ssdp:alive")

    def bye(self):
        """Broadcast multiple relevant `ssdp:byebye` message."""
        self._notify_all(nts="ssdp:byebye")

    def answer(self, ip: str, port: int, message: str):
        """Answer a SSDP message from given IP and port."""
        if message.startswith("M-SEARCH"):
            self._answer_discover(ip, port)
        elif message.startswith("NOTIFY"):
            print(f"Received NOTIFY message from {ip}:{port}:\n{message}")
        else:
            print(f"Unhandled SSDP message: {message}")

    def _answer_discover(self, ip: str, port: int):
        """Answer a `ssdp:discover` request from given IP and port, like:

        ```
        M-SEARCH * HTTP/1.1
        MX: 1
        ST: upnp:rootdevice
        MAN: "ssdp:discover"
        User-Agent: Linux/3.0.0 UPnP/1.0 Platinum/1.0.5.13
        Connection: close
        Host: 239.255.255.250:1900
        ```
        """
        message = (
            "HTTP/1.1 200 OK\r\n"
            f"ST: upnp:rootdevice\r\n"
            f"USN: uuid:{UUID}::upnp:rootdevice\r\n"
            f"Location: http://{IP}:{HTTP_PORT}/dummy-renderer/DeviceSpec\r\n"
            'OPT:"http://schemas.upnp.org/upnp/1/0/"; ns=01\r\n'
            "Cache-Control: max-age=900\r\n"
            f"Server: {SERVER_NAME}\r\n"
            "EXT:\r\n"
            f"Date: {gmt_time()}\r\n"
            "\r\n"
        )
        self.sock.sendto(message.encode('utf-8'), (ip, port))

    def run(self):
        print(f"SSDP server running on {IP}:{SSDP_PORT}")
        while True:
            try:
                data, addr = self.sock.recvfrom(4096)
                message = data.decode('utf-8')
                print(f"[SSDP] Received message from {addr[0]}:{addr[1]}:\n{message}")
                self.answer(addr[0], addr[1], message)
            except Exception as e:
                print(f"Error: {e}")

class HTTPRequestHandler(BaseHTTPRequestHandler):
    """HTTP request handler for the dummy UPnP renderer. Endpoints:

    - /dummy-renderer/RenderingControl
    - /dummy-renderer/DeviceSpec
    - /dummy-renderer/AVTransport
    - /dummy-renderer/Ignore
    """
    def do_GET(self):
        print(f"GET request from {self.client_address[0]}:{self.client_address[1]} to {self.path}")
        print(f"Headers: {self.headers}")
        if self.path == "/dummy-renderer/DeviceSpec":
            self.send_response(200)
            self.send_header("Content-Type", "text/xml; charset=utf-8")
            self.end_headers()
            self.wfile.write(DEVICE_SPEC_XML)
        elif self.path == "/dummy-renderer/RenderingControl":
            self.send_response(200)
            self.send_header("Content-Type", "text/xml; charset=utf-8")
            self.end_headers()
            self.wfile.write(RENDERING_CONTROL_XML)
        elif self.path == "/dummy-renderer/AVTransport":
            self.send_response(200)
            self.send_header("Content-Type", "text/xml; charset=utf-8")
            self.end_headers()
            self.wfile.write(AV_TRANSPORT_XML)
        elif self.path == "/dummy-renderer/Ignore":
            self.send_response(204)  # No Content
            self.end_headers()
        else:
            self.send_error(404, "Not Found")

    def do_POST(self):
        # Log the request details
        print(f"POST request from {self.client_address[0]}:{self.client_address[1]} to {self.path}")
        print(f"Headers: {self.headers}")
        print(f"Body: {self.rfile.read(int(self.headers.get('Content-Length', 0))).decode('utf-8')}")
        if self.path == "/dummy-renderer/DeviceSpec":
            # Errors for now
            self.send_error(718, "Invalid InstanceID") # UPnP error code for "Invalid InstanceID"
            # See 5.4.32 Common Error Codes of AVTransport-v3-Service
        elif self.path == "/dummy-renderer/RenderingControl":
            self.send_error(718, "Invalid InstanceID")
        elif self.path == "/dummy-renderer/AVTransport":
            self.send_error(718, "Invalid InstanceID")
        elif self.path == "/dummy-renderer/Ignore":
            self.send_error(718, "Invalid InstanceID")
        else:
            self.send_error(404, "Not Found")

if __name__ == "__main__":
    # Start SSDP server
    ssdp_server = SSDPServer()
    ssdp_server.start()
    ssdp_server.alive()

    # Start HTTP server
    httpd = HTTPServer((IP, HTTP_PORT), HTTPRequestHandler)
    print(f"HTTP server running on {IP}:{HTTP_PORT}")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Shutting down the server...")
        ssdp_server.bye()
        httpd.server_close()
        print("Server stopped.")
```

它打印了所有 `GET` 和 `POST` 请求，但是仍然需要自己在一大堆日志内找到网址然后自行解码。无论如何，对于局域网内的其它设备，它确实是一个货真价实的 DMR。

### Rust

最终我将这份代码迁移到了 Rust，日志输出如下：

```shell
$ dlna-dmr
[2025-05-30T14:49:48Z INFO  dlna_dmr] DMR started
[2025-05-30T14:49:48Z INFO  dlna_dmr::ssdp] SSDP server running on 172.31.117.144:1900
[2025-05-30T14:49:48Z INFO  dlna_dmr::http] HTTP server listening on 172.31.117.144:8080
[2025-05-30T14:50:11Z INFO  dlna_dmr::http] RenderingControl::SetMute channel: Master, desired_mute: false
[2025-05-30T14:50:38Z INFO  dlna_dmr::http] AVTransport::SetAvTransportUri current_uri: http://example.com/sample.mp4?param1=a&param2=b
^C
[2025-05-30T14:50:46Z INFO  dlna_dmr::http] HTTP server stopped
[2025-05-30T14:50:46Z INFO  dlna_dmr::ssdp] SSDP server stopped
[2025-05-30T14:50:46Z INFO  dlna_dmr] DMR stopped
```

这就已经很明晰了。为了减少输出，我只输出了设置状态的指令，而忽略查询状态的指令。代码仓库就在 [PRO-2684/dlna-dmr](https://github.com/PRO-2684/dlna-dmr/)，欢迎大家尝试。

## 参考资料

- 抓包结果（文档看很久理解不能，果然还是得实践出真知）
- UPnP 的文档（和抓包结果互为补充，不明白的字段可以查文档）
    - [MediaRenderer-v1-Device](https://upnp.org/specs/av/UPnP-av-MediaRenderer-v1-Device.pdf)
    - [AVTransport-v1-Service](https://upnp.org/specs/av/UPnP-av-AVTransport-v1-Service.pdf)
    - [RenderingControl-v1-Service](https://upnp.org/specs/av/UPnP-av-RenderingControl-v1-Service.pdf)
