#!/usr/bin/python
# 用于把中国国债数据转换格式存入到数据库的Python程序。

import xlrd
import os
import time
from pymongo import MongoClient

def getFileNames(path): 
    filenames = []
    filelist = os.listdir(path)
    for filename in filelist: 
        filepath = path + '/' + filename
        filenames.append(filepath) 
    return filenames 

def readXLSX(file):
    table = xlrd.open_workbook(file)
    sheet = table.sheets()[0]
    dates = sheet.col_values(0)
    dates = list(set(dates))
    data_count = (sheet.nrows - 1) / (len(dates) - 1)
    print('data_count = ' + str(data_count))
    count = 0
    data = []
    for i in range(1, len(dates)):
        doc = {}
        for j in range(1, int(data_count) + 1):
            seriesNo =  (i - 1) * data_count + j
            row = sheet.row_values(int(seriesNo))
            doc['Date'] = row[0]
            doc['T' + row[1]] = row[3]
        data.append(doc)
    # print(data)
    print('数据量 = ' + str(len(data)))
    return data


# readXLSX('./Project/PCAOnBonds/中国国债/中国国债历年信息/2017年中债国债收益率曲线标准期限信息.xlsx')
# readXLSX(r'F:\graduation-design\Project\WebProject\Data2Mongo\ChinaBonds\2018年中债国债收益率曲线标准期限信息.xlsx')
files = getFileNames(r'F:\graduation-design\Project\PCAOnBonds\中国国债\中国国债历年信息')
files.append(r'F:\graduation-design\Project\WebProject\Data2Mongo\ChinaBonds\2018年中债国债收益率曲线标准期限信息.xlsx')
for file in files:
    data = readXLSX(file)
    dbo = MongoClient('localhost', 27017)
    collection = dbo.BondsData.ChinaBonds
    collection.insert_many(data)
    dbo.close()
print('数据插入完成！')