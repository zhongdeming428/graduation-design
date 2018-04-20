import scipy.stats as stats
import numpy as np


alpha = 0.05     # confidence level
beta = 1- alpha  # significance level

mu, sigma = 0.000522, 0.011717    # ~N(0,1)
VaR = sigma * np.abs(stats.norm.ppf(alpha))
print(VaR)