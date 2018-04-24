#!/usr/bin/python

import xlrd
from pymongo import MongoClient

def insertDB(DB, Collection, fileNames):
    conn = MongoClient('localhost', 27017)
    db = conn[DB]
    collection = db[Collection]
    datas = readExcel(fileNames)
    for data in datas:
        if collection.find_one(data) == None:
            collection.insert_one(data)
    conn.close()

def readExcel(filenames):
    datas = []
    for name in filenames:
        table = xlrd.open_workbook(name)
        sheet = table.sheets()[0]
        for i in range(1, sheet.nrows):
            doc = {}
            row = sheet.row_values(i)
            doc['Code'] = row[0]
            doc['Name'] = row[1]
            doc['FullPrice'] = row[2]
            doc['RateofYear'] = row[3]
            doc['Maturity'] = row[4]
            doc['RemainingPeriod'] = row[5]
            doc['NetPrice'] = row[6]
            doc['AccrualDays'] = row[7]
            doc['AccruedInterest'] = row[8]
            doc['InterestPaymentMethod'] = row[9]
            doc['Yield'] = row[10]
            doc['ModifiedDuration'] = row[11]
            doc['Convexity'] = row[12]
            doc['Exchange'] = row[13]
            datas.append(doc)
    return datas


insertDB('BondsData', 'DetailData', [r'.\Project\WebProject\Data2Mongo\所有详细数据\数据\全部国债.xlsx'])
