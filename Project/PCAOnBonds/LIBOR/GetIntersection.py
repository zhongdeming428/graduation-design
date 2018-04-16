#!/usr/bin/python

import xlrd

def readXLSX(path):
    data = xlrd.open_workbook(path)
    table = data.sheets()[0]
    cols = []
    for i in range(table.ncols):
        col = table.col_values(i)
        cols.append(col)
    return cols

# cols = readXLSX('./Project/PCAOnBonds/LIBOR/LIBOR历年信息汇总/LIBOR日期数据.xlsx')

# 求list中所有list交集的函数，返回交集list。
def getIntersection(cols):
    result = []
    for date in cols[0]:
        count = 0
        for col in cols[1:]:
            if date in col:
                count = count + 1
        if count == len(cols) - 1:
            result.append(date)
    return result

def list2CSV(list):
    string = ''
    for item in list:
        string = string + str(item) + '\n'
    file = open('./Project/PCAOnBonds/LIBOR/LIBOR历年信息汇总/共有日期.csv', 'w')
    file.write(string)
    file.close()


# print(getIntersection([[1,2,3], [1,3], [1,2,3,4,5]]))
result = getIntersection(readXLSX('./Project/PCAOnBonds/LIBOR/LIBOR历年信息汇总/LIBOR日期数据.xlsx'))
list2CSV(result)