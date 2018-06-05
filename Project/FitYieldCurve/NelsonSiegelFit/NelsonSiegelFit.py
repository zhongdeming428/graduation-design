#!/usr/bin/python

import pylab
from numpy import *
from scipy.optimize import fmin
import pandas as pd
print("")

# N-S模型函数，c代表N-S的四个参数，x代表maturity到期期限。
fp = lambda c, x: c[0]+(c[1]+c[2])*(c[3]/x)*(1-exp(-x/c[3])-c[2]*exp(-x/c[3]))


# 误差计算函数，是fmin优化的参考标准。
e = lambda p, x, y: ((fp(p,x)-y)**2).sum()


# x = array([1,2,3,5,7,10])  #The periods for which data are available, skip the periods with empty rate
# y = array([2.05/100,1.98/100,2.23/100,2.80/100,3.24/100,3.77/100])  #Available rates only

x = array([1,3,5,7,10,15,20,30])
y = array([3.2013,3.3682,3.5205,3.6916,3.7062,3.9689,4.0079,4.1207])

# y = array([2.7484,2.8265,2.8877,3.0364,3.1054,3.5303,3.5605,3.6226])

# 使用fmin进行优化。
p0 = array([0.01,0.01,0.01,1.00])
# p即为最优解，结构类似p0。
p = fmin(e, p0, args=(x,y))
c = p
j=[]
# 计算整数到期期限节点的收益率。
for h in range(1,51,1):
    j.append(c[0]+(c[1]+c[2])*(c[3]/h)*(1-exp(-h/c[3])-c[2]*exp(-h/c[3])))

for i in j:
    print(i)

# 计算出的最优N-S参数。
print("")
print('Estimated Parameters: ', p)


# 开始插值。
print("")
h = range(1,51,1)
# 打印节点数据。
rateTable = pd.DataFrame.from_items([('Period', h),('NS', j)])
print(rateTable.to_string())

sum = 0
y1 = [3.2013,3.3682,3.5205,3.6916,3.7062,3.9689,4.0079,4.1207]
# y1 = [2.7484,2.8265,2.8877,3.0364,3.1054,3.5303,3.5605,3.6226]
for i,v in enumerate([1,3,5,7,10,15,20,30]):
    res = j[i+1]
    sum = sum + (res - y1[i])**2
mean = sum / len(x)
error = sqrt(mean)
print('RMSE:', str(mean))

# xx = array([1,2,5,10,25,30])
# 图表展示。
xx = array([1,3,5,7,10,15,20,30,40,50])
pylab.plot(x, y, 'ro')
pylab.plot(xx, fp(p,xx), 'b')
pylab.title('Nelson-Siegel')
pylab.show()

