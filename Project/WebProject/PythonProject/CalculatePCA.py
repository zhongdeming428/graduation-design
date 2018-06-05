#!/usr/bin/python

import numpy as np
import uuid
import sys

csvPath = sys.argv[1]
componentCount = int(sys.argv[2])

# 读取.csv文件的函数，返回一个numpy矩阵。
def readCSV(path):
    data = np.genfromtxt(path, delimiter=',', skip_header=True)
    matrix = np.matrix(data)
    return matrix

# 计算贡献率的函数。
def calculateContribRate(eigenVals):  
    sortArray=np.sort(eigenVals)
    sortArray=sortArray[-1::-1]
    arraySum=sum(sortArray)
    # rates = [['贡献度','占比', '累计占比']]
    # rates = '贡献度,占比,累计占比\n'
    rates = ''
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
    # print(calculateContribRate(eigenVals))
    rates = calculateContribRate(eigenVals)
    ratesPath = 'F:\\graduation-design\\Project\\WebProject\\NodeProject\\data\\' + str(uuid.uuid1()) +  '.csv'
    print(ratesPath)
    f = open(ratesPath, 'w')
    f.write(rates)
    f.close()
    # 将特征值从小到大进行排序。
    eigenValsIndex = np.argsort(eigenVals)
    # 返回从尾部开始的指定项。
    eigenValsIndex = eigenValsIndex[:-(count + 1):-1]
    # 按照特征值重新选取特征向量。
    newEigenVectors = eigenVectors[:, eigenValsIndex]
    # lowDDataMat即为降维后的矩阵（已经归一化）。
    # print('各指标对应系数：')
    # print(newEigenVectors)
    D2Matrix2CSV(newEigenVectors, csvPath)
    lowDDataMat = meanRemoved * newEigenVectors
    return lowDDataMat

loadingPath = 'F:\\graduation-design\\Project\\WebProject\\NodeProject\\data\\' + str(uuid.uuid1()) + '.csv'
print(loadingPath)
PCA(readCSV(csvPath), componentCount, loadingPath)
# PCA(readCSV(r'F:\graduation-design\Project\WebProject\NodeProject\data\SHIBOR数据.csv'), 3, loadingPath)
