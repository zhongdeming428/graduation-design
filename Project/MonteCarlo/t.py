#!/usr/bin/python

import numpy as np
import pylab as pl

datas = np.random.normal(3,1.4142135623730951,10000)
print(3-3*1.4142135623730951-np.min(datas))
pl.hist(datas, histtype='stepfilled')
pl.xlabel('data')
pl.show()
# print(datas)

# def VaR(Mean, StdDev, SimNum, Confidence_Interval = 0.95):
#     datas = np.random.normal(Mean, StdDev, SimNum)
#     flag = 0
#     count = 0
#     if Confidence_Interval == 0.95:
#         flag = Mean - 2 * StdDev
#     elif Confidence_Interval == 0.99:
#         flag = Mean - 3 * StdDev
#     else:
#         print('The value of parameter Confidence_Interval is incorrect!')
#     for data in datas:
#         if data < flag:
#             count = count + 1
#     p = count / SimNum
#     return p

# print(VaR(3, 1.4142135623730951, 10000, 0.99))