from aiohttp import ClientSession, ClientTimeout, TCPConnector
from aiohttp import client_exceptions
from re import search
from datetime import datetime

import asyncio

# PREFIX = "./.github/website-check/"
PREFIX = ""
WEBSITES = PREFIX + "./websites.txt"
TEMPLATE = PREFIX + "./template.md"
DESTINATION = PREFIX + "../../notes/cn_domains.md"

async def test_url(session, cn_host):
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
            return {"status": False, "cn_host": cn_host, "host": "danger", "location": "", "title": "", "info": f"网站重定向到非教育网站 {location}"}
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

async def main():
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
    # loop = asyncio.new_event_loop()
    # asyncio.set_event_loop(loop)
    # results = loop.run_until_complete(asyncio.gather(*tasks))
    # results = asyncio.run(asyncio.gather(*tasks))
        results = await asyncio.gather(*tasks)
    results.sort(key=key)
    with open(TEMPLATE, "r", encoding="utf-8") as f:
        template = f.read()
    md = template.replace("{{updated}}", datetime.now().strftime("%Y-%m-%d"))
    content = ""
    for result in results:
        # | 学校 | 中文域名 | 状态 | 备注 |
        if result["status"]:
            line = f"| [{result['title']}]({result['location']}) | {make_link(result['cn_host'])} | 🟢 | {result['info']} |\n"
        else:
            line = f"| 未知 | {make_link(result['cn_host'])} | 🔴 | {result['info']} |\n"
        content += line
        print(line.strip())
    md = md.replace("{{content}}", content)
    with open(DESTINATION, "w", encoding="utf-8") as f:
        f.write(md)

if __name__ == "__main__":
    asyncio.run(main())
