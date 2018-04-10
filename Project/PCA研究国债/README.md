# Python爬虫

这个文件夹用于存放我所开发的用于爬取收益率曲线的Python爬虫.

## 中国国债

该文件夹用于存放所有关于研究中国国债的资料。

### 主要程序：

* GetExcel.py
* Excel2CSV.py
* PCA.py

### 依赖包：

* urllib.request
* pyquery
* xlrd
* os
* numpy

### 作用

* GetExcel.py负责从中债网抓取中国2002年到2017年所有的每日标准期限信息，以.xlsx格式存储到本地。
* Excel2CSV.py负责将所有存储在.xlsx中的数据进行整合清理，筛选出期限为0, 0.08, 0.17, 0.25, 0.5, 0.75, 1, 3, 5, 7, 10, 15, 20, 30年的数据，并保存到.csv文件中（方便Python程序以及SPSS数据分析软件使用）。
* PCA.py负责将.csv文件中的数据读取到内存中，通过numpy包转化为矩阵，对齐进行归一化、求协方差矩阵、求特征值、求特征向量、乘积等一系列矩阵运算，最终提取出指定个数的主成分，输出每个成分的贡献度以及降维之后的数据。

## 美国国债

### 数据来源

[美国财政部官网](https://www.treasury.gov/resource-center/data-chart-center/interest-rates/Pages/TextView.aspx?data=yieldYear&year=2015)

## 下一步

* 研究其他python实现PCA的方法，主要是matplotlib中的PCA方法
* 研究提取出主因子后的下一步。