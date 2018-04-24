#!/usr/bin/python
# 用于更新数据库中新闻公告详细数据的python脚本。

import urllib.request as request
from pyquery import PyQuery as pq
from pymongo import MongoClient

url = r'http://bond.hexun.com/news/index.html'
content = request.urlopen(url).read().decode('gb2312')
query = pq(content)
div = query('#temp01')
print(lis)