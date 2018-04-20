#!/usr/bin/python

import numpy as np
import pylab as pl
from scipy.stats import norm

# datas = np.random.normal(3,1.4142135623730951,10000)
# print(3-3*1.4142135623730951-np.min(datas))
# pl.hist(datas, histtype='stepfilled')
# pl.xlabel('data')
# pl.show()
# print(datas)

# def VaR(Mean, StdDev, SimNum, Confidence_Interval = 0.95):
    # norm.rvs(3,)

# print(VaR(3, 1.4142135623730951, 10000, 0.99))
# data = norm.rvs(3, 1.4142135623730951, 10000)
data = norm.rvs(0.09, 0.04, 10000)
var = np.abs(norm.ppf(0.05)) * np.std(data)
print(var)
# print(np.mean(data))
# print(np.std(data))