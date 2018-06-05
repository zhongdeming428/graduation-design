#!/usr/bin/python

import xlrd
from pymongo import MongoClient
from Modules import getFileNames

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
            doc['InterestRateDay'] = row[6]
            doc['ExpiryDate'] = row[7]
            doc['InterestPaymentMethod'] = row[8]
            doc['PreTaxYield'] = row[9]
            doc['AfterTaxYield'] = row[10]
            doc['CreditLevel'] = row[11]
            doc['ModifiedDuration'] = row[12]
            doc['Convexity'] = row[13]
            doc['Exchange'] = row[14]
            datas.append(doc)
    return datas


insertDB('BondsData', 'DetailData', ['./Project/WebProject/Data2Mongo/所有详细数据/数据/沪企债.xlsx', './Project/WebProject/Data2Mongo/所有详细数据/数据/深企债.xlsx'])
