from aiohttp import ClientSession, TCPConnector
from aiohttp import client_exceptions
from re import search
from datetime import datetime
from time import time_ns as time

import asyncio

DEBUG = False
PREFIX = ".github/website-check/" if DEBUG else ""
WEBSITES = PREFIX + "./websites.txt"
TEMPLATE = PREFIX + "./template.md"
DESTINATION = PREFIX + "../../notes/cn_domains.md"

async def test_url(session: ClientSession, cn_host: str, https: bool = True):
    """测试网站的状态

    :param cn_host: 中文域名
    :return: 网站状态、学校 host、Markdown、网站状态信息"""
    url = f"https://{cn_host}/" if https else f"http://{cn_host}/"
    try:
        async with session.get(url) as r:
            if r.status != 200:
                return {"status": -2, "cn_host": cn_host, "host": "error", "location": "", "title": "", "info": f"网站无法正常访问，状态码为 {r.status}", "https": https}
            url = r.url
            location = url.human_repr()
            text = await r.text()
        if url.host.endswith(".edu.cn"):
            title = search(r"<title>(.*)</title>", text)
            title = title.group(1) if title else "无标题"
            title = title.replace("|", "").replace("[", "").replace("]", "").replace("\n", "").replace("\r", "").strip()
            return {"status": 1, "cn_host": cn_host, "host": url.host, "location": location, "title": title, "info": f"网站正常重定向到 {location}", "https": https}
        elif url.host == cn_host:
            return {"status": 0, "cn_host": cn_host, "host": cn_host, "location": url, "title": "未知", "info": "网站可能被盗用，也可能使用了 js 实现重定向", "https": https}
        else:
            location = location.split("?")[0] # 移除 URL 参数，避免跟踪
            return {"status": -1, "cn_host": cn_host, "host": "danger", "location": "", "title": "", "info": f"网站重定向到疑似垃圾网站 `{location}`", "https": https}
    except client_exceptions.ServerTimeoutError:
        return {"status": -2, "cn_host": cn_host, "host": "error", "location": "", "title": "", "info": "网站连接超时 (ConnectTimeout)", "https": https}
    except client_exceptions.ClientConnectorError:
        if https: # 尝试使用 http 连接
            return await test_url(session, cn_host, https=False)
        return {"status": -2, "cn_host": cn_host, "host": "error", "location": "", "title": "", "info": "网站连接错误，可能是域名已过期 (ConnectionError)", "https": https}
    except Exception as e:
        return {"status": -2, "cn_host": cn_host, "host": "error", "location": "", "title": "", "info": f"未知异常 ({e})!!!", "https": https}

def make_link(host: str, https: bool = True):
    """生成链接

    :param host: 域名
    :return: Markdown 链接"""
    return f"[{host}]({'https' if https else 'http'}://{host})"

def key(result):
    """排序用的 key

    :param result: 结果
    :return: 排序用的 key"""
    title = result["title"]
    cn_host = result["cn_host"]
    status = result["status"]
    if status == 1:
        return f"1{title}{cn_host}"
    elif status == 0:
        return f"2{cn_host}"
    elif status == -1:
        return f"3{cn_host}"
    else:
        return f"4{cn_host}"

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
    async with ClientSession(connector=connector, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.46"}) as session:
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
    sus = 0
    sel = {True: "🟢", False: "🔴"}
    for result in results:
        # | 学校 | 中文域名 | 状态 | HTTPS? | 备注 |
        if result["status"] == 1:
            line = f"| [{result['title']}]({result['location']}) | {make_link(result['cn_host'], result['https'])} | 🟢 | {sel[result['https']]} | {result['info']} |\n"
            alive += 1
        elif result["status"] == 0:
            line = f"| 未知 | {make_link(result['cn_host'], result['https'])} | 🟡 | {sel[result['https']]} | {result['info']} |\n"
            sus += 1
        else:
            line = f"| 未知 | {make_link(result['cn_host'], result['https'])} | 🔴 | / | {result['info']} |\n"
        content += line
        print(line.strip())
    t3 = time()
    md = md.replace("{{total}}", str(total)).replace("{{alive}}", str(alive)).replace("{{sus}}", str(sus)) # 替换统计数据
    md = md.replace("{{g1}}", proper_time(t2 - t1)).replace("{{g2}}", proper_time(t3 - t2)) # 替换统计时间
    md = md.replace("{{content}}", content) # 替换表格
    with open(DESTINATION, "w", encoding="utf-8") as f:
        f.write(md)

if __name__ == "__main__":
    asyncio.run(main())
