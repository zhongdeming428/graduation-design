#!/usr/bin/python

import xlrd
import os

dimensions = [0, 0.08, 0.17, 0.25, 0.5, 0.75, 1, 3, 5, 7, 10, 15, 20, 30]

def getFileNames(path): 
    filenames = []
    filelist = os.listdir(path)  

    for filename in filelist:  
        # filepath = os.path.join(path, filename)  
        filepath = path + '/' + filename
        filenames.append(filepath) 
    return filenames 

def readXLSX(path):
    data = xlrd.open_workbook(path)
    table = data.sheets()[0]
    count = 0
    string = ''
    for i in range(table.nrows):
        row = table.row_values(i)
        if(row[2] in dimensions):
            string = string + str(row[3]) + ','
            count = count + 1
        if(count >= 14):
            count = 0
            string = string[0:-1] + '\n'
    file = open('./Project/PCA研究国债/中国国债/中国国债历年信息汇总/国债数据.csv', 'a')
    file.write(string)
    file.close()

fileNames = getFileNames('./Project/PCA研究国债/中国国债/中国国债历年信息')
for file in fileNames:
    readXLSX(file)