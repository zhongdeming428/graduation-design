#!/usr/bin/python

import numpy as np
import pylab

# 基于numpy.polynomial.hermite.hermfit封装的拟合函数。
def hermiteFit(x, y, deg):
    return np.polynomial.hermite.hermfit(np.array(x), np.array(y), deg)

# 读取.csv文件中的数据。
data = np.genfromtxt('./Project/FitYieldCurve/TestData.csv', delimiter=',',skip_header=False)
# print(data)
x = []
y = []

for d in data:
    x.append(d[0])
    y.append(d[1])

# 注意返回的拟合函数各项系数是从低阶到高阶排序的。
res = hermiteFit(x, y, 3)
print('拟合三次Hermite函数的各项系数（从低到高）：', res)

def getRes(params, x):
    return res[3]*x**3 + res[2]*x**2 + res[1]*x + res[0]

# 打印拟合结果。
for d in x:
    print(getRes(res, d))

# 计算RMSE。
sum = 0
for i,v in enumerate(x):
    sum = sum + (getRes(res, v) - y[i])**2
mean = sum / len(x)
error = np.sqrt(mean)
print('RMSE:', str(mean))

# 展示图表。
estimateRes = []
for d in x:
    estimateRes.append(getRes(res, d))
pylab.plot(np.array(x), np.array(y), 'ro')
pylab.plot(np.array(x), np.array(estimateRes), 'b')
pylab.title('HermiteFit')
pylab.show()