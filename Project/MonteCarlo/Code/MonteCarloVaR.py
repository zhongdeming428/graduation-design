#!/usr/bin/python
# 用于计算VaR的python程序。

import numpy as np
import pylab as pl
from scipy.stats import norm
import matplotlib.mlab as mlab
import matplotlib.pyplot as plt

rawData = [4.7572,4.7555,4.774,5.0474,5.0751,5.0918,5.0995,5.1492,5.1459,5.1766,5.1866,5.1894,5.207,5.2494,5.2832,5.2649,5.3144,5.3373,5.3506,5.3875,5.4211,5.4335,5.4538,5.4653,5.4502,5.4274,5.4415,5.459,5.4566,5.4505,5.4254,5.4369,5.4486,5.4645,5.458,5.4457]
mu = np.mean(rawData)
sigma = np.std(rawData)
confidence_interval = 0.99

data = norm.rvs(mu, sigma, 10000)
var = np.abs(norm.ppf(1-confidence_interval)) * np.std(data)
print(var)
# print(data)
string = ''
for d in data:
    string = string + str(d) + ','
file = open('./Project/MonteCarlo/Data/SimulationData.csv', 'w')
file.write(string)
file.close()

num_bins = 50
fig, ax = plt.subplots()
n, bins, patches = ax.hist(data, num_bins, normed=1)

y = mlab.normpdf(bins, mu, sigma)
ax.plot(bins, y, '--')
ax.set_xlabel('Smarts')
ax.set_ylabel('Probability density')
ax.set_title(r'Histogram of IQ: $\mu='+str(mu)+r'$, $\sigma='+str(sigma)+'$')

fig.tight_layout()
plt.show()