#!/usr/bin/python

import sys
from pymongo import MongoClient
from numpy import *
from scipy.optimize import fmin
import pandas as pd
import json

# 关闭浮点数溢出的警告。
seterr(over='ignore')
x = sys.argv[1]
y = sys.argv[2]
# x = '[1, 2, 4]'
# y = '[2, 2, 2]'
x = json.loads(x)
y = json.loads(y)
maxYear = max(x)

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
for index, data in enumerate(x):
    doc['Y' + str(data)] = y[index]
        
for key in doc:
    print(key + ':' + str(doc[key]))