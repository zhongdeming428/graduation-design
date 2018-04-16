#!/usr/bin/python

import numpy
import pylab

# 利用numpy实现的多项式拟合函数。
def polyfit(x, y, deg):
    coeffs = numpy.polyfit(x, y, deg)
    return coeffs.tolist()

# 读取.csv中的测试数据。
data = numpy.genfromtxt('./Project/FitYieldCurve/TestData.csv',skip_header=False,delimiter=',')
# print(data)
x = []
y = []
for d in data:
    x.append(d[0])
    y.append(d[1])

# z1即为拟合后得到的三次多项式的各项系数组成的list。
z1 = polyfit(x, y, 3)
print("拟合的三次多项式系数：",z1)
# 该函数使用传入的各项系数构造一个三次多项式，并将x代入，返回计算结果。
def polyFunc(params,x):
    return params[0]*x**3 + params[1]*x**2 + params[2]*x**1 + params[3]

# 打印代入x到拟合的三次多项式后计算出的结果。
for d in x:
    print(polyFunc(z1, d))

# 与实际数据作比较，计算均方根误差便于与其他模型方法作对比。
sum = 0
for i,v in enumerate(x):
    sum = sum + (polyFunc(z1, v) - y[i])**2
mean = sum / len(x)
error = numpy.sqrt(mean)
print('RMSE:', str(mean))

# 曲线展示。
estimateRes = []
for d in x:
    estimateRes.append(polyFunc(z1, d))
pylab.plot(numpy.array(x), numpy.array(y), 'ro')
pylab.plot(numpy.array(x), numpy.array(estimateRes), 'b')
pylab.title('PolyFit')
pylab.show()