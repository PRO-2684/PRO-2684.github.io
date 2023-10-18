from aiohttp import ClientSession, TCPConnector
from aiohttp import client_exceptions
from re import search
from datetime import datetime
from time import time_ns as time

import asyncio

WEBSITES = "./websites.txt"
TEMPLATE = "./template.md"
DESTINATION = "../../notes/cn_domains.md"

async def test_url(session: ClientSession, cn_host: str):
    """测试网站的状态

    :param cn_host: 中文域名
    :return: 网站状态、学校 host、Markdown、网站状态信息"""
    url = f"https://{cn_host}/"
    try:
        async with session.get(url) as r:
            if r.status != 200:
                return {"status": False, "cn_host": cn_host, "host": "error", "location": "", "title": "", "info": f"网站无法正常访问，状态码为 {r.status}"}
            url = r.url
            location = url.human_repr()
            text = await r.text()
        if url.host.endswith(".edu.cn"):
            title = search(r"<title>(.*)</title>", text)
            title = title.group(1) if title else "无标题"
            return {"status": True, "cn_host": cn_host, "host": url.host, "location": location, "title": title, "info": f"网站正常重定向到 {location}"}
        elif url.host == cn_host:
            return {"status": True, "cn_host": cn_host, "host": cn_host, "location": url, "title": "未知", "info": "网站可能使用了 js 实现重定向"}
        else:
            location = location.split("?")[0] # 移除 URL 参数，避免跟踪
            return {"status": False, "cn_host": cn_host, "host": "danger", "location": "", "title": "", "info": f"网站重定向到疑似垃圾网站 `{location}`"}
    except client_exceptions.ServerTimeoutError:
        return {"status": False, "cn_host": cn_host, "host": "error", "location": "", "title": "", "info": "网站连接超时 (ConnectTimeout)"}
    except client_exceptions.ClientConnectorError:
        return {"status": False, "cn_host": cn_host, "host": "error", "location": "", "title": "", "info": "网站连接错误，可能是域名已过期 (ConnectionError)"}
    except Exception as e:
        return {"status": False, "cn_host": cn_host, "host": "error", "location": "", "title": "", "info": f"未知异常 ({e})!!!"}

def make_link(host):
    """生成链接

    :param host: 域名
    :return: Markdown 链接"""
    return f"[{host}](https://{host})"

def key(result):
    """排序用的 key

    :param result: 结果
    :return: 排序用的 key"""
    host = result["host"]
    if host == "danger" or host == "error":
        return "2" + host
    else:
        return "1" + host

def proper_time(t: int):
    """将时间转换为人类可读的格式

    :param t: 时间 (ns)
    :return: 人类可读的格式"""
    if t < 1000:
        return f"{t} ns"
    elif t < 1000000:
        return f"{t / 1000} μs"
    elif t < 1000000000:
        return f"{t / 1000000} ms"
    else:
        return f"{t / 1000000000} s"

async def main():
    t1 = time()
    connector = TCPConnector(limit=10)
    with open(WEBSITES, "r", encoding="utf-8") as f:
        websites = f.readlines()
    tasks = []
    async with ClientSession(connector=connector) as session:
        for website in websites:
            website = website.strip()
            if not website or website.startswith("#"):
                continue # 空行或注释
            task = test_url(session, website)
            tasks.append(task)
        results = await asyncio.gather(*tasks)
    t2 = time()
    results.sort(key=key)
    with open(TEMPLATE, "r", encoding="utf-8") as f:
        template = f.read()
    md = template.replace("{{updated}}", datetime.now().strftime("%Y-%m-%d"))
    content = ""
    total = len(results)
    alive = 0
    for result in results:
        # | 学校 | 中文域名 | 状态 | 备注 |
        if result["status"]:
            line = f"| [{result['title']}]({result['location']}) | {make_link(result['cn_host'])} | 🟢 | {result['info']} |\n"
            alive += 1
        else:
            line = f"| 未知 | {make_link(result['cn_host'])} | 🔴 | {result['info']} |\n"
        content += line
        print(line.strip())
    t3 = time()
    md = md.replace("{{total}}", str(total)).replace("{{alive}}", str(alive)) # 替换统计数据
    md = md.replace("{{g1}}", proper_time(t2 - t1)).replace("{{g2}}", proper_time(t3 - t2)) # 替换统计时间
    md = md.replace("{{content}}", content) # 替换表格
    with open(DESTINATION, "w", encoding="utf-8") as f:
        f.write(md)

if __name__ == "__main__":
    asyncio.run(main())
