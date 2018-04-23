#!/usr/bin/python

from Modules import getFileNames, insertDB

db = 'BondsData'
collection = 'ChinaBonds'
fileNames = getFileNames('./Project/PCAOnBonds/中国国债/中国国债历年信息')
insertDB(db, collection, fileNames)

