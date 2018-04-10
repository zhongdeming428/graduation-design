#!/usr/bin/python

import numpy as np

ChinaBond = './Project/PCA研究国债/中国国债/中国国债历年信息汇总/国债数据.csv'
AmericaBond = './Project/PCA研究国债/美国国债/美国国债历年信息汇总/国债数据 - FoPython.csv'
CSVChina = './Project/PCA研究国债/中国国债/中国国债历年信息汇总/各项指标对应系数.csv'
CSVAmerica = './Project/PCA研究国债/美国国债/美国国债历年信息汇总/各项指标对应系数.csv'

# 读取.csv文件的函数，返回一个numpy矩阵。
def readCSV(path):
    data = np.genfromtxt(path, delimiter=',', skip_header=True)
    matrix = np.matrix(data)
    return matrix

# readCSV('./Project/PCA研究国债/中国国债/中国国债历年信息汇总/国债数据.csv')

# 计算贡献率的函数。
def calculateContribRate(eigenVals):  
    sortArray=np.sort(eigenVals)
    sortArray=sortArray[-1::-1]
    arraySum=sum(sortArray)
    # rates = [['贡献度','占比', '累计占比']]
    rates = '贡献度,占比,累计占比\n'
    sumRate = 0
    for num in sortArray:
        sumRate = sumRate + num
        # rate = [num,  num/arraySum, sumRate/arraySum]
        rate = str(num) + ',' + str(num/arraySum) + ',' + str(sumRate/arraySum) + '\n'
        # rates.append(rate)
        rates = rates + rate
    return rates

# 二维矩阵写入到CSV文本的函数。
def D2Matrix2CSV(matrix, path):
    string = ''
    for ma in matrix.tolist():
        for m in ma:
            string = string + str(m) + ','
        string = string[0:-1] + '\n'
    file = open(path, 'w')
    file.write(string)
    file.close()

# 处理矩阵，做PCA处理。
def PCA(matrix, count, csvPath):
    # 求每一列的均值，即每个维度的均值。
    meanVals = np.mean(matrix, axis=0)
    # 每一项都减去均值。
    meanRemoved = matrix - meanVals
    # 求协方差矩阵。
    covMat = np.cov(meanRemoved, rowvar=0)
    eigenVals, eigenVectors = np.linalg.eig(np.mat(covMat))
    # 打印累计贡献率。
    print(calculateContribRate(eigenVals))
    # 将特征值从小到大进行排序。
    eigenValsIndex = np.argsort(eigenVals)
    # 返回从尾部开始的指定项。
    eigenValsIndex = eigenValsIndex[:-(count + 1):-1]
    # 按照特征值重新选取特征向量。
    newEigenVectors = eigenVectors[:, eigenValsIndex]
    # lowDDataMat即为降维后的矩阵（已经归一化）。
    # newEigenVectors即为各指标对应系数。
    print('各指标对应系数：')
    print(newEigenVectors)
    # D2Matrix2CSV(newEigenVectors, csvPath)
    lowDDataMat = meanRemoved * newEigenVectors
    return lowDDataMat

# import numpy as np
# from matplotlib.mlab import PCA

# 以下是使用matplotlib模块实现PCA，但是还不清楚返回值具体的属性，没有接口文档可供参考。
# data = np.array(readCSV('./Project/PCA研究国债/中国国债/中国国债历年信息汇总/国债数据.csv'))
# results = PCA(data)
# print(results.Wt)
# print(results.Y)
# print(results.a)
# print(results.fracs)
# print(results.mu)
# print(results.s)
# print(results.sigma)


print(PCA(readCSV(AmericaBond), 3, CSVAmerica))
