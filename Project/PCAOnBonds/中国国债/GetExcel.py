#!/usr/bin/python

import urllib.request
from pyquery import PyQuery as pq

# 国债数据下载页面网址
url = 'http://www.chinabond.com.cn/cb/cn/zzsj/cywj/syqx/sjxz/zzgzqx/list.shtml'
# 网址域名
host = 'http://www.chinabond.com.cn'

# 从主页面获取下载页面的url
def getUrls(url, host):
    # 用于存放所有excel下载网址
    urls = []
    content = urllib.request.urlopen(url)
    html = content.read().decode("utf-8")
    query = pq(html)
    # 选取所有需要的a标签
    a_list = query('.unlock>a')
    for a in a_list:
        urls.append(host + a.attrib['href'])
    return urls

# 根据下载页面的url，获取下载链接，然后下载文件
def downloadXlsxs(urls, host):
    for url in urls:
        content = urllib.request.urlopen(url)
        html = content.read().decode('utf-8')
        query = pq(html)
        download_url = host + query('.zw_malei3 a')[0].attrib['href']
        file_name = query('.zw_malei3 a')[0].attrib['title']
        download_content = urllib.request.urlopen(download_url)
        file = open('./Project/PCAOnBonds/中国国债/中国国债历年信息/' + file_name, 'wb')
        file.write(download_content.read())
        file.close()

urls = getUrls(url, host)
downloadXlsxs(urls, host)