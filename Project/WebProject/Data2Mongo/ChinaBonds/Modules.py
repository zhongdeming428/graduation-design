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
            doc['MaturityInstruction'] = row[1]
            doc['Maturity'] = row[2]
            doc['Yield'] = row[3]
            datas.append(doc)
    return datas

def insertDB(DB, Collection, fileNames):
    conn = MongoClient('localhost', 27017)
    db = conn[DB]
    collection = db[Collection]
    collection.insert_many(readExcel(fileNames))
    conn.close()