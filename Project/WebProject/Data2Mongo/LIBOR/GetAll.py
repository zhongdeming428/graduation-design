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
            doc['M10'] = row[1]
            doc['M11'] = row[2]
            doc['M12'] = row[3]
            doc['M1'] = row[4]
            doc['W1'] = row[5]
            doc['M2'] = row[6]
            doc['W2'] = row[7]
            doc['M3'] = row[8]
            doc['M4'] = row[9]
            doc['M5'] = row[10]
            doc['M6'] = row[11]
            doc['M7'] = row[12]
            doc['M8'] = row[13]
            doc['M9'] = row[14]
            doc['O/N'] = row[15]
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

insertDB('BondsData', 'LIBOR', [r'.\Project\PCAOnBonds\LIBOR\LIBOR历年信息汇总\汇总数据.xlsx'])
