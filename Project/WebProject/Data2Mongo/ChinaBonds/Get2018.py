#!/usr/bin/python
# 2018版的程序已经进行了去重操作，所以以后如果有更新，只需要运行这个程序就OK了。

import xlrd
from pymongo import MongoClient

def readExcel(filenames):
    datas = []
    for name in filenames:
        table = xlrd.open_workbook(name)
        sheet = table.sheets()[0]
        for i in range(1, sheet.nrows):
            doc = {}
            row = sheet.row_values(i)
            doc['Date'] = row[0]
            doc['MaturityInstruction'] = row[1]
            doc['Maturity'] = row[2]
            doc['Yield'] = row[3]
            datas.append(doc)
    return datas

def insertDB(DB, Collection, fileNames):
    conn = MongoClient('localhost', 27017)
    db = conn[DB]
    collection = db[Collection]
    datas = readExcel(fileNames)
    for data in datas:
        if collection.find_one(data) == None:
            collection.insert_one(data)
    conn.close()


fileNames = ['./Project/WebProject/Data2Mongo/ChinaBonds/2018年中债国债收益率曲线标准期限信息.xlsx']

db = 'BondsData'
collection = 'ChinaBonds'
insertDB(db, collection, fileNames)

# print(len(readExcel(filenames)))