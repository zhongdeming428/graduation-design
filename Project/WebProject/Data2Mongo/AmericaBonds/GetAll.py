#!/usr/bin/python

import os
import xlrd
from pymongo import MongoClient

def getFileNames(path): 
    filenames = []
    filelist = os.listdir(path)  

    for filename in filelist: 
        filepath = path + '/' + filename
        filenames.append(filepath) 
    return filenames 

def readExcel(filenames):
    datas = []
    for name in filenames:
        table = xlrd.open_workbook(name)
        sheet = table.sheets()[0]
        for i in range(1, sheet.nrows):
            doc = {}
            row = sheet.row_values(i)
            doc['Date'] = row[0]
            if isinstance(row[0], float):
                datetime = xlrd.xldate.xldate_as_tuple(row[0], 0)
                year = str(datetime[0])
                month = '0' + str(datetime[1]) if len(str(datetime[1])) == 1 else str(datetime[1])
                day = '0' + str(datetime[2]) if len(str(datetime[2])) == 1 else str(datetime[2])
                time = year + '/' + month + '/' + day
                doc['Date'] = time
            doc['M1'] = row[1]
            doc['M3'] = row[2]
            doc['M6'] = row[3]
            doc['Y1'] = row[4]
            doc['Y2'] = row[5]
            doc['Y3'] = row[6]
            doc['Y5'] = row[7]
            doc['Y7'] = row[8]
            doc['Y10'] = row[9]
            doc['Y20'] = row[10]
            doc['Y30'] = row[11]
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

insertDB('BondsData', 'AmericaBonds', getFileNames('./Project/PCAOnBonds/美国国债/美国国债历年信息'))
