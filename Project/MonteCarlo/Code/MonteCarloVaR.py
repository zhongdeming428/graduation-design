import scipy.stats as stats
import numpy as np


alpha = 0.05     # confidence level
beta = 1- alpha  # significance level

data = [4.7572,4.7555,4.774,5.0474,5.0751,5.0918]

mu, sigma = np.mean(data), np.std(data)    # ~N(0,1)
VaR = sigma * np.abs(stats.norm.ppf(alpha))
print(VaR)