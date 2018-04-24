#!/usr/bin/python
# 用于更新数据库中中债VaR的数据。

import urllib.request as request
from pyquery import PyQuery as pq
from pymongo import MongoClient

props = {
    '0':'CalculateDate',
    '1':'Code',
    '2':'Name',
    '3':'HoldingPeriod',
    '4':'ConfidenceLevel',
    '5':'Exchange',
    '6':'VaR',
    '7':'CVaR'
}

url = r'http://yield.chinabond.com.cn/cbweb-mn/var/var_main?locale=zh_CN'
content = request.urlopen(url).read().decode('utf-8')
query = pq(content)
trs = query('.td02')
data = []
for tr in trs:
    doc = {}
    for i, td in enumerate(tr):
        if i == 4:
            doc[props[str(i)]] = td.text.replace(' \r\n\t\t\t\t\t\t','')
        else:
            doc[props[str(i)]] = td.text
    data.append(doc)
# print(data)

count1 = 0
count2 = 0
collection = MongoClient('localhost', 27017).BondsData.ZZVaR
for d in data:
    if collection.find_one(d) == None:
        collection.insert_one(d)
        count1 = count1 + 1
    else:
        collection.update_one({'Code':d['Code']}, {'$set':d})
        count2 = count2 + 1
print('新增'+str(count1)+'条，更新'+str(count2)+'条中债VaR数据。')