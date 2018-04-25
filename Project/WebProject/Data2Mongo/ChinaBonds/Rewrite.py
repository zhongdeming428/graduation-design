#!/usr/bin/python

import xlrd
import os
import time
import copy

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
    doc = {}
    # for i in range(1, sheet.nrows):
    #     row = sheet.row_values(i)
    #     # ...
    #     doc['T' + row[1]] = row[3]
    #     count = count + 1
    #     if count == data_count:
    #         data.append(copy.deepcopy(doc))
    for i, v in sheet.col_values(1)[1:]:
        doc = {}
        doc['T' + sheet.col_values(1)[i]] = sheet.col_values(3)
        count = count + 1
        if()
    print(data)


readXLSX('./Project/PCAOnBonds/中国国债/中国国债历年信息/2003年中债国债收益率曲线标准期限信息.xlsx')