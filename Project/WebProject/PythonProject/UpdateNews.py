#!/usr/bin/python
# 用于更新数据库中新闻公告详细数据的python脚本。

import urllib.request as request
from pyquery import PyQuery as pq
from pymongo import MongoClient
import time as T

url = r'http://bond.eastmoney.com/news/czqxw.html'
content = request.urlopen(url).read().decode('utf-8')
count = 0
# print(content)
query = pq(content)
divs = query('.text')
data = []
for div in divs:
    doc = {}
    doc['Title'] = div[0][0].text.replace('\r\n', '').replace(' ', '')
    doc['Url'] = div[0][0].attrib['href']
    data.append(doc)
    count = count + 1
times = query('p.time')
for i, time in enumerate(times):
    data[i]['Time'] = time.text.replace('\r\n', '').replace(' ', '')
    data[i]['UpdateTime'] = T.time()
# print(data)
# 插入数据库。
collection = MongoClient('localhost', 27017).BondsData.News
for d in data:
    if collection.find_one(d) == None:
        collection.insert_one(d)
print('更新' + str(count) + '条债券新闻。')