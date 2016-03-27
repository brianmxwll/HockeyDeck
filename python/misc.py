import urllib2
import json
import os.path
import pickle
from datetime import datetime

def getPickleData(name):
    #Return nothing if we don't have a file
    if not os.path.isfile(name):
        return None
    
    f = open(name, 'r')
    data = pickle.load(f) 
    f.close()
    return data

def savePickleData(name, data):
    f = open(name, 'w')
    data = pickle.dump(data, f) 
    f.close()

def getNowString():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

#Wizard - http://codegolf.stackexchange.com/a/4712
def getOrdinal(n):
    if isinstance(n, basestring):
        n = int(n)
    return "%d%s" % (n,"tsnrhtdd"[(n/10%10!=1)*(n%10<4)*n%10::4])
