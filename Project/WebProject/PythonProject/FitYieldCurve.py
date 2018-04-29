#!/usr/bin/python

import sys
from pymongo import MongoClient
from numpy import *
from scipy.optimize import fmin
import pandas as pd

# 关闭浮点数溢出的警告。
seterr(over='ignore')
Type = sys.argv[1]
Date = sys.argv[2]
# Type = '1'
# Date = '2016/01/04'
Dic = {
    '1': 'ChinaBonds',
    '2': 'AmericaBonds'
}
Cols = {
    'T0d': 'Y0',
    'T1m': 'Y0.08',
    'T2m': 'Y0.17',
    'T3m': 'Y0.25',
    'T6m': 'Y0.5',
    'T9m': 'Y0.75',
    'T1y': 'Y1',
    'T2y': 'Y2',
    'T3y': 'Y3',
    'T4y': 'Y4',
    'T5y': 'Y5',
    'T6y': 'Y6',
    'T7y': 'Y7',
    'T8y': 'Y8',
    'T9y': 'Y9',
    'T10y': 'Y10',
    'T15y': 'Y15',
    'T20y': 'Y20',
    'T30y': 'Y30',
    'T40y': 'Y40',
    'T50y': 'Y50',
    'M1': 'Y0.08',
    'M3': 'Y0.25',
    'M6': 'Y0.5',
    'Y1': 'Y1',
    'Y2': 'Y2',
    'Y3': 'Y3',
    'Y4': 'Y4',
    'Y5': 'Y5',
    'Y6': 'Y6',
    'Y7': 'Y7',
    'Y8': 'Y8',
    'Y9': 'Y9',
    'Y10': 'Y10',
    'Y20': 'Y20',
    'Y30': 'Y30',
    'Y40': 'Y40',
    'Y50': 'Y50'
}

if Dic[Type] == None:
    raise TypeError
conn = MongoClient('localhost', 27017)
collection = conn.BondsData[Dic[Type]]
result = collection.find_one({'$or': [{'Date': Date[0:4]+'-'+Date[5:7]+'-'+Date[8:]}, {'Date': Date[0:4]+'/'+Date[5:7]+'/'+Date[8:]}, {'Date': Date[5:7] + '/' + Date[8:] + '/' + Date[2:4]}]});
if result == None:
    print('None')
    exit(0);
x = []
_x = []
y = []
if Type == '1':
    for i, key in enumerate(result):
        if(i >= 8):
            _x.append(int(key[1:-1]))
            if result[key] != 'N/A':
                x.append(int(key[1:-1]))
                y.append(float(result[key]))
if Type == '2':
    for i, key in enumerate(result):
        if(i >= 5):
            _x.append(int(key[1:]))
            if result[key] != 'N/A':
                x.append(int(key[1:]))
                y.append(float(result[key]))

maxYear = max(_x)

# N-S模型函数，c代表N-S的四个参数，x代表maturity到期期限。
fp = lambda c, x: c[0]+(c[1]+c[2])*(c[3]/x)*(1-exp(-x/c[3])-c[2]*exp(-x/c[3]))
# 误差计算函数，是fmin优化的参考标准。
e = lambda p, x, y: ((fp(p,x)-y)**2).sum()
# x = array([1,3,5,7,10,15,20,30])
# y = array([3.2013,3.3682,3.5205,3.6916,3.7062,3.9689,4.0079,4.1207])
x = array(x)
y = array(y)
# 使用fmin进行优化。
p0 = array([0.01,0.01,0.01,1.00])
# p即为最优解，结构类似p0。
p = fmin(e, p0, args=(x,y))
c = p
j=[]
# 计算整数到期期限节点的收益率。
for h in range(1, maxYear + 1,1):
    j.append(c[0]+(c[1]+c[2])*(c[3]/h)*(1-exp(-h/c[3])-c[2]*exp(-h/c[3])))
# for i in j:
#     print(i)
#  记得筛选数据。
doc = {}
for index, num in enumerate(j):
    doc['Y' + str(index + 1)] = num
for i, key in enumerate(result):
    if i > 1:
        doc[Cols[key]] = result[key]
        
for key in doc:
    print(key + ':' + str(doc[key]))
