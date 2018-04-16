import pylab
from numpy import *
from scipy.optimize import fmin
import pandas as pd
print("")
# parametric function, x is the independent variable
# and c are the parameters.
# it's a polynomial of degree 2
fp = lambda c, x: c[0]+(c[1]+c[2])*(c[3]/x)*(1-exp(-x/c[3])-c[2]*exp(-x/c[3]))


# error function to minimize
e = lambda p, x, y: ((fp(p,x)-y)**2).sum()

# generating data with noise

# x = array([1,2,3,5,7,10])  #The periods for which data are available, skip the periods with empty rate
# y = array([2.05/100,1.98/100,2.23/100,2.80/100,3.24/100,3.77/100])  #Available rates only

x = array([1,3,5,7,10,15,20,30])
y = array([3.2013,3.3682,3.5205,3.6916,3.7062,3.9689,4.0079,4.1207])


# fitting the data with fmin
p0 = array([0.01,0.01,0.01,1.00])  # initial parameter value
p = fmin(e, p0, args=(x,y))
c = p
j=[]
for h in range(1,51,1):
    j.append(c[0]+(c[1]+c[2])*(c[3]/h)*(1-exp(-h/c[3])-c[2]*exp(-h/c[3])))

for i in j:
    print(i)

print("")
print('Estimated Parameters: ', p)
print("")
print('Initial Parameters: ', p0)


#To display interpolated data.
print("")
h = range(1,51,1)
rateTable = pd.DataFrame.from_items([('Period', h),('NS', j)])
print(rateTable.to_string())

# xx = array([1,2,5,10,25,30])
xx = array([1,3,5,7,10,15,20,30,40,50])
pylab.plot(x, y, 'ro')
pylab.plot(xx, fp(p,xx), 'b')
pylab.title('Nelson-Siegel')
pylab.show()