#!/usr/bin/python
# 用作测试。

import scipy.stats as stats
import numpy as np


alpha = 0.01     # confidence level
beta = 1- alpha  # significance level

# data = [4.7572,4.7555,4.774,5.0474,5.0751,5.0918]
data = [4.7572,4.7555,4.774,5.0474,5.0751,5.0918,5.0995,5.1492,5.1459,5.1766,5.1866,5.1894,5.207,5.2494,5.2832,5.2649,5.3144,5.3373,5.3506,5.3875,5.4211,5.4335,5.4538,5.4653,5.4502,5.4274,5.4415,5.459,5.4566,5.4505,5.4254,5.4369,5.4486,5.4645,5.458,5.4457]

mu, sigma = np.mean(data), np.std(data)    # ~N(0,1)
VaR = sigma * np.abs(stats.norm.ppf(alpha)) * np.sqrt(10)
print(VaR)