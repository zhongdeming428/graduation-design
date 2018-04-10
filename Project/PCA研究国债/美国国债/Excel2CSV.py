#!/usr/bin/python

import xlrd
import os

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
        if i > 0:
            row = table.row_values(i)
            for col in row[1:]:
                if col == 'N/A':
                    string = string + ' ,'
                else:
                    string = string + str(col) + ','
                count = count + 1
            if(count >= 11):
                count = 0
                string = string[0:-1] + '\n'
    file = open('./Project/PCA研究国债/美国国债/美国国债历年信息汇总/国债数据.csv', 'a')
    file.write(string)
    file.close()

fileNames = getFileNames('./Project/PCA研究国债/美国国债/美国国债历年信息')
for file in fileNames:
    readXLSX(file)