#!/usr/bin/python
# 用于更新数据库中中债估值的数据。

import urllib.request as request
from pyquery import PyQuery as pq
from pymongo import MongoClient

props = {
    '0':'ValuationDate',
    '1':'Name',
    '2':'Code',
    '3':'Exchange',
    '4':'RepaymentPeriod',
    '5':'DailyValuationFullPrice',
    '6':'AccruedInterestDuringTheDay',
    '7':'ValuationNetPrice',
    '8':'ValuationYield',
    '9':'CreditLevel'
}
url = r'http://yield.chinabond.com.cn/cbweb-mn/val/val_query_list?locale=zh_CN'
content = request.urlopen(url).read().decode('utf-8')
query = pq(content)
table = query('#table1')[0]
data = []
for tr in table[1:]:
    doc = {}
    for i, td in enumerate(tr):
        if i%2 != 0:
            doc[props[str(i - int(i/2) - 1)]] = td.text
    data.append(doc)
# print(data)

count1 = 0
count2 = 0
collection = MongoClient('localhost', 27017).BondsData.ZZValuation
for d in data:
    if collection.find_one({'Code':d['Code']}) == None:
        collection.insert_one(d)
        count1 = count1 + 1
    else:
        collection.update_one({'Code':d['Code']}, {'$set':d})
        count2 = count2 + 1
print('新增'+str(count1)+'条，更新'+str(count2)+'条中债估值数据。')