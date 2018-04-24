#!/usr/bin/python

import os

def getFileNames(path): 
    filenames = []
    filelist = os.listdir(path)  

    for filename in filelist: 
        filepath = path + '/' + filename
        filenames.append(filepath) 
    return filenames 
