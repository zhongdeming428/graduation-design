#!/usr/bin/python

import xlrd
import os

# 将.xlsx中的数据读取到字典中。
def xlsx2Dic(path):
    data = xlrd.open_workbook(path)
    table = data.sheets()[0]
    dic = {}
    for i in range(table.nrows):
        row = table.row_values(i)
        dic[row[0]] = row[1]
    return dic

# d = xlsx2Dic(r'F:\graduation-design\Project\PCA研究国债\LIBOR\LIBOR历年信息\LIBOR1WEEK.xlsx')
# print(d)

def getFileNames(path): 
    filenames = []
    filelist = os.listdir(path)  

    for filename in filelist:  
        # filepath = os.path.join(path, filename)  
        filepath = path + '/' + filename
        filenames.append(filepath) 
    return filenames 


data = xlrd.open_workbook('./Project/PCA研究国债/LIBOR/LIBOR历年信息汇总/共有日期.xlsx')
table = data.sheets()[0]
# 获取所有共有日期。
col = table.col_values(0)
results = []
for file in getFileNames('./Project/PCA研究国债/LIBOR/LIBOR历年信息'):
    dic = xlsx2Dic(file)
    result = []
    for date in col[1:]:
        result.append(dic[date])
    results.append(result)
# print(results)
string = ''
for row in results:
    rowStr = ''
    for col in row:
        rowStr = rowStr + str(col) + ','
    string = string + rowStr + '\n'
file = open('./Project/PCA研究国债/LIBOR/LIBOR历年信息汇总/汇总数据.csv', 'w')
file.write(string)
file.close()
    