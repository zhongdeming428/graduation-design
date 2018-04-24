#!/usr/bin/python
# 用于更新数据库中企债详细数据的python脚本。

import urllib.request
from pyquery import PyQuery as pq
from pymongo import MongoClient

url = r'http://bond.money.hexun.com/data/bond_corpbondissue_list.htm'
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
    '6':'InterestRateDay',
    '7':'ExpiryDate',
    '8':'InterestPaymentMethod',
    '9':'PreTaxYield',
    '10':'AfterTaxYield',
    '11':'CreditLevel',
    '12':'ModifiedDuration',
    '13':'Convexity',
    '14':'Exchange'
}

req = urllib.request.Request(url=url, headers=headers, method='GET')
content = urllib.request.urlopen(req)
# 编码格式不是utf-8，通过查看meta标签，得到编码格式为改变2312。
# print(content.read().decode('gb2312'))
query = pq(content.read().decode('gb2312'))
tables = query('.dataTab>tbody')
# 沪企债数据表格。
table1 = tables[0]
# 深企债数据表格。
table2 = tables[1]
# 存储沪企债数据的list。
data1 = []
# 存储深企债数据的list。
data2 = []
for tr in table1:
    doc = {}
    for i, td in enumerate(tr):
        if i != 1:
            doc[props[str(i)]] = td.text
        else:
            doc[props[str(i)]] = td[0].text
    doc['Exchange'] = 'SH'
    data1.append(doc)
for tr in table2:
    doc = {}
    for i, td in enumerate(tr):
        if i != 1:
            doc[props[str(i)]] = td.text
        else:
            doc[props[str(i)]] = td[0].text
    doc['Exchange'] = 'SZ'
    data2.append(doc)

count1_1 = 0
count1_2 = 0
count2_1 = 0
count2_2 = 0
# 插入数据库。
conn = MongoClient('localhost', 27017)
collection = conn.BondsData.DetailData
for data in data1:
    if collection.find_one({'Code':data['Code']}) == None:
        collection.insert_one(data)
        count1_1 = count1_1 + 1
    else:
        collection.update_one({'Code':data['Code']}, {'$set':data})
        count1_2 = count1_2 + 1
for data in data2:
    if collection.find_one({'Code':data['Code']}) == None:
        collection.insert_one(data)
        count2_1 = count2_1 + 1
    else:
        collection.update_one({'Code':data['Code']}, {'$set':data})
        count2_2 = count2_2 + 1
print('新增'+str(count1_1)+'条'+'，更新'+str(count1_2)+'条沪企债数据。\n'+'新增'+str(count2_1)+'条'+'，更新'+str(count2_2)+'条深企债数据。\n')