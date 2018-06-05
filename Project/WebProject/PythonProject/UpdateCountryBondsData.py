#!/usr/bin/python
# 用于更新数据库中国债详细数据的python脚本。

import urllib.request
from pyquery import PyQuery as pq
from pymongo import MongoClient

url = r'http://bond.money.hexun.com/data/bond_nationaldebt_list.htm'
# 使用headers属性修改请求头，伪造一个浏览器，因为和讯网进行了防爬虫处理，所以不伪造的话会返回403forbidden的错误。
headers = {
    "User-Agent":'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3080.5 Safari/537.36',
}
props = {
    '0':'Code',
    '1':'Name',
    '2':'FullPrice',
    '3':'RateofYear',
    '4':'Maturity',
    '5':'RemainingPeriod',
    '6':'NetPrice',
    '7':'AccrualDays',
    '8':'AccruedInterest',
    '9':'InterestPaymentMethod',
    '10':'Yield',
    '11':'ModifiedDuration',
    '12':'Convexity',
    '13':'Exchange'
}

req = urllib.request.Request(url=url, headers=headers, method='GET')
content = urllib.request.urlopen(req)
# 编码格式不是utf-8，通过查看meta标签，得到编码格式为改变2312。
# print(content.read().decode('gb2312'))
query = pq(content.read().decode('gb2312'))
tables = query('.dataTab>tbody')
# 国债数据表格。
table = tables[0]
# 存储国债数据的list。
datas = []
for tr in table:
    doc = {}
    for i, td in enumerate(tr):
        if i != 1:
            doc[props[str(i)]] = td.text
        else:
            doc[props[str(i)]] = td[0].text
    doc['Exchange'] = 'GZ'
    datas.append(doc)

count1 = 0
count2 = 0
# 插入数据库。
conn = MongoClient('localhost', 27017)
collection = conn.BondsData.DetailData
for data in datas:
    if collection.find_one({'Code':data['Code']}) == None:
        collection.insert_one(data)
        count1 = count1 + 1
    else:
        collection.update_one({'Code':data['Code']}, {'$set':data})
        count2 = count2 + 1
print('新增'+str(count1)+'条'+'，更新'+str(count2)+'条国债债数据。\n')