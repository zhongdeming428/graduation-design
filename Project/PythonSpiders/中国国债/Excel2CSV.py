#!/usr/bin/python

import xlrd
import os

dimensions = [0, 0.08, 0.17, 0.25, 0.5, 0.75, 1, 3, 5, 7, 10, 15, 20, 30]

def getFileNames(path): 
    filenames = []
    filelist = os.listdir(path)  

    for filename in filelist:  
        filepath = os.path.join(path, filename)  
        filenames.append(filepath) 
    return filenames 

def readXLSX(path):
    data = xlrd.open_workbook(path)
    table = data.sheets()[0]
    csv = []
    count = 0
    for i in range(table.nrows):
        if(count == 0):
            new_row = []
        row = table.row_values(i)
        if(row[2] in dimensions):
            new_row.append(row[3])
            count = count + 1
        if(count >= 14):
            count = 0
            csv.append(new_row)
    print(csv)

readXLSX('./Project/PythonSpiders/中国国债/中国国债历年信息/2002年中债国债收益率曲线标准期限信息.xlsx')