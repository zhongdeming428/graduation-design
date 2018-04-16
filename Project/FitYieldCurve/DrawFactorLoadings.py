#!/usr/bin/python

import pylab 
import numpy

x = range(121)

def L(x):
    return 1

# 先假设lamda为1.
def S(x):
    return (1-numpy.exp(-0.064*x))/(0.064*x)

def C(x):
    return (1-numpy.exp(-0.064*x))/(0.064*x) - numpy.exp(-0.064*x)

LR = []
CR = []
SR = []

for d in x:
    LR.append(L(d))
    SR.append(S(d))
    CR.append(C(d))

pylab.plot(numpy.array(x), numpy.array(LR), 'b')
pylab.plot(numpy.array(x), numpy.array(SR), 'b')
pylab.plot(numpy.array(x), numpy.array(CR), 'b')
pylab.title('FactorLoadings')
pylab.show()