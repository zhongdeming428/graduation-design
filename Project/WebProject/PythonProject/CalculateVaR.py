#!/usr/bin/python

import sys
import re
import numpy as np
from scipy.stats import norm
import xlrd

data = sys.argv[1]
confidenceLevel = float(sys.argv[2])
holdingPeriod = int(sys.argv[3])
simCount = int(sys.argv[4])

# data = '1,2,3,4'
# confidenceLevel = 0.95
# holdingPeriod = 1
# simCount = 10000

def calculateVaR(data, confidenceLevel, holdingPeriod, simCount):
    mu = np.mean(data)
    sigma = np.std(data)
    confidence_interval = confidenceLevel

    data = norm.rvs(mu, sigma, simCount)
    var = np.abs(norm.ppf(1-confidence_interval)) * np.std(data) * holdingPeriod
    return var

if re.search('[a-zA-Z]', data) == None:
    # 手动填写的数据，data是数据字符串。
    if re.search('，', data) != None:
        data = data.split('，')
    else:
        data = data.split(',')
    yields = []
    for d in data:
        yields.append(float(d))
    print(str(calculateVaR(yields, confidenceLevel, holdingPeriod, simCount)))
else :
    # 上传的数据文件，data是文件名。
    file_type = data.split('.')[1]
    if file_type == 'csv':
        # csv文件。
        yields = np.genfromtxt(data, dtype=float, delimiter=',', skip_header=False)
        print(str(calculateVaR(yields, confidenceLevel, holdingPeriod, simCount)))
    else:
        # xlsx文件。
        table = xlrd.open_workbook(data)
        sheet = table.sheets()[0]
        col = sheet.col_values(0)
        yields = []
        for r in col:
            yields.append(float(r))
        print(str(calculateVaR(yields, confidenceLevel, holdingPeriod, simCount)))
