var MongoClient = require('mongodb').MongoClient;
var DB = {
    '1': 'ChinaBonds',
    '2': 'AmericaBonds',
    '3': 'SHIBOR',
    '4': 'LIBOR'
};
var url = "mongodb://localhost:27017";

//用于获取新闻公告数据的函数。
var getNewsData = function(url, res) {
    MongoClient.connect(url, function(err, dbo) {
        if (err) res.status(500).send(err);
        var db = dbo.db('BondsData');
        var collection = db.collection('News');
        collection.find().sort({UpdateTime:-1}).limit(10).toArray((err, result) => {
            if(err)
                res.status(500).send(err)
            console.log('获取新闻公告数据成功！');
            res.status(200).send(result.sort((a, b) => {
                a = '2018年' + a.Time;
                b = '2018年' + b.Time;
                return new Date(b) - new Date(a)
            }))
        });
        dbo.close();
    });
};

//用于获取债券数据的函数。
var getBondsData = function(url, type, year, res) {
    MongoClient.connect(url, function(err, dbo) {
        if(err)
            res.status(500).send(err);
        var db = dbo.db('BondsData');
        var collection = db.collection(DB[type + '']);
        if(year == null) {
            collection.find().sort({'Date':-1}).limit(1).toArray(function(err, result) {
                if(err)
                    res.status(500).send(err);
                year = result[0].Date.substring(0, result[0].Date.indexOf('/'));
                collection.find({$or:[{'Date': new RegExp(year + '\\/.+')}, {'Date': new RegExp('^\\d\\d\\/\\d\\d\\/'+String(year).substring(2)+'$')}]}).sort({'Date':-1}).toArray(function(err, result) {
                    if(err)
                    res.status(500).send(err);
                    var data = {};
                    result.forEach(r => {
                        r.Date = r.Date.replace(/\-/g, '/');
                        if(/^\d\d\/\d\d\/\d\d$/.test(String(r.Date))) {
                            r.Date = '20' + r.Date.substring(r.Date.lastIndexOf('/') + 1) + '/' + r.Date.substring(0, 5);
                        }
                    });
                    data.data = result;
                    collection.distinct('Date').then(dates => {
                        var datesRes = [];
                        dates.forEach(date => {
                            var temp;
                            date = date.replace(/\-/g, '/');
                            if(/^\d\d\/\d\d\/\d\d$/.test(String(date))) {
                                temp = '20' + date.substring(date.lastIndexOf('/') + 1);
                            }
                            else 
                                temp = date.substring(0, date.indexOf('/'));
                            if(datesRes.indexOf(temp) < 0)
                                datesRes.push(temp);
                        });
                        datesRes.sort((a, b) => {
                            return a - b;
                        });
                        data.dates = datesRes;
                        res.send(data);
                        res.end();
                    }, err => {
                        res.status(500).send(err);
                    });
                });
            });
        }
        else {
            collection.find({$or:[{'Date': new RegExp(year + '[\\/-].+')}, {'Date': new RegExp('^\\d\\d[\\/-]\\d\\d[\\/-]'+String(year).substring(2)+'$')}]}).sort({'Date': -1}).toArray(function(err, result) {
                if(err)
                    res.status(500).send(err);
                var data = {};
                result.forEach(r => {
                    r.Date = r.Date.replace(/\-/g, '/');
                    if(/^\d\d\/\d\d\/\d\d$/.test(String(r.Date))) {
                        r.Date = '20' + r.Date.substring(r.Date.lastIndexOf('/') + 1) + '/' + r.Date.substring(0, 5);
                    }
                });
                data.data = result;
                collection.distinct('Date').then(dates => {
                    var datesRes = [];
                    dates.forEach(date => {
                        var temp;
                        date = date.replace(/\-/g, '/');
                        if(/^\d\d\/\d\d\/\d\d$/.test(String(date))) {
                            temp = '20' + date.substring(date.lastIndexOf('/') + 1);
                        }
                        else 
                            temp = date.substring(0, date.indexOf('/'));
                        if(datesRes.indexOf(temp) < 0)
                            datesRes.push(temp);
                    });
                    datesRes.sort((a, b) => {
                        return a - b;
                    });
                    data.dates = datesRes;
                    res.send(data);
                    res.end();
                }, err => {
                    res.status(500).send(err);
                });
            });
        }
    })
};


// getBondsData("mongodb://localhost:27017", 1, 2016)

// 下载Excel的接口方法。
var getExcel = function(type, year) {
    var path = '';
    switch(type) {
        case '1': path = 'F:\\graduation-design\\Project\\PCAOnBonds\\中国国债\\中国国债历年信息\\' + year + '年中债国债收益率曲线标准期限信息.xlsx'; break;
        case '2': path = 'F:\\graduation-design\\Project\\PCAOnBonds\\美国国债\\美国国债历年信息\\美国国债' + year + '年收益数据.xlsx'; break;
        case '3': path = 'F:\\graduation-design\\Project\\PCAOnBonds\\SHIBOR\\SHIBOR历年信息\\Shibor数据' + year + '.xls'; break;
        case 'SZ': path = 'F:\\graduation-design\\Project\\WebProject\\Data2Mongo\\所有详细数据\\数据\\深企债.xlsx'; break;
        case 'SH': path = 'F:\\graduation-design\\Project\\WebProject\\Data2Mongo\\所有详细数据\\数据\\沪企债.xlsx'; break;
        case 'GZ': path = 'F:\\graduation-design\\Project\\WebProject\\Data2Mongo\\所有详细数据\\数据\\全部国债.xlsx'; break;
        default: throw TypeError('type标志错误！');
    }
    if(year == 2018 && type == 1) {
        path = 'F:\\graduation-design\\Project\\WebProject\\Data2Mongo\\ChinaBonds\\2018年中债国债收益率曲线标准期限信息.xlsx';
    }
    return path;
};

// 获取所有债券详细数据的接口方法。
var getDetailData = function(url, type, res) {
    MongoClient.connect(url, function(err, dbo) {
        if (err) res.status(500).send(err);
        var db = dbo.db('BondsData');
        var collection = db.collection('DetailData');
        collection.find({'Exchange': type}).sort({Code:-1}).toArray((err, result) => {
            if(err)
                res.status(500).send(err);
            res.status(200).send(result);
            res.end();
            dbo.close();
        });
    });
};

// 获取中债估值历史数据的接口方法。
var getZZValuation = function(url, res) {
    MongoClient.connect(url, function(err, dbo) {
        if(err)
            res.status(500).send(err);
        else {
            var db = dbo.db('BondsData');
            var collection = db.collection('ZZValuation');
            collection.find().sort({'ValuationDate': -1}).toArray(function(err, result) {
                if(err)
                    res.status(500).send(err);
                else {
                    var data = [];
                    result.forEach(function(r) {
                        var obj = {};
                        var keys = Object.keys(r);
                        keys.forEach(k => {
                            if(k !== '_id') {
                                obj[k] = r[k];
                            }
                        });
                        data.push(obj);
                    });
                    res.send(data);
                    res.end();
                }
            });
        }
    });
};

var getZZVaR = function(url, res) {
    MongoClient.connect(url, function(err, dbo) {
        if(err)
            res.status(500).send(err);
        else {
            var db = dbo.db('BondsData');
            var collection = db.collection('ZZVaR');
            collection.find().sort({'CalculateDate': -1}).toArray(function(err, result) {
                if(err)
                    res.status(500).send(err);
                else {
                    res.send(result);
                    res.end();
                }
            });
        }
    });
};

var verifyLogin = function(url, userName, password, res) {
    MongoClient.connect(url, function(err, dbo) {
        if(err) {
            return res.send(err);
        }
        else {
            var db = dbo.db('BondsData');
            var collection = db.collection('Accounts');
            collection.find({'userName': userName}).toArray(function(err, result) {
                if(err) {
                    return res.send(err);
                }
                else {
                    if(result.length == 0) {
                        res.send('-1');
                        res.end();
                    }
                    else {
                        collection.find({ 'userName': userName, 'password': password }).toArray(function (err, result) {
                            if (err) {
                                return res.send(err);
                            }
                            else {
                                if (result.length == 0) {
                                    return res.send('0');
                                }
                                else if (result.length == 1) {
                                    return res.send('1');
                                }
                            }
                        });
                    }
                }
            });
        }
    });
};

var verifyCookie = function(url, userName, password) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, dbo) {
            if (err)
                reject(err);
            else {
                var db = dbo.db('BondsData');
                var collection = db.collection('Accounts');
                collection.find({ userName, password }).toArray(function (err, res) {
                    if (err)
                        reject(err);
                    else {
                        if (res.length == 0) {
                            resolve(-1);
                        }
                        else {
                            resolve(1);
                        }
                    }
                });
            }
        });
    });
};

var searchOneCollection = function(url, code, type, name) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function(err, dbo) {
            if(err)
                return err;
            else {
                var db = dbo.db('BondsData');
                var collection;
                switch(type) {
                    case '1':
                    case '2':
                    case '3': collection = db.collection('DetailData');break;
                    case '4': collection = db.collection('ZZVaR');break;
                    case '5': collection = db.collection('ZZValuation');break;
                }
                if(code == '') {
                    // 根据债券简称name来搜索。
                    if(type == 1) {
                        collection.find({'Name': new RegExp('.*'+name+'.*'), 'Exchange': 'GZ'}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                    else if(type == 2) {
                        collection.find({'Name': new RegExp('.*'+name+'.*'), 'Exchange': 'SH'}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                    else if(type == 3) {
                        collection.find({'Name': new RegExp('.*'+name+'.*'), 'Exchange': 'SZ'}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                    else {
                        collection.find({'Name': new RegExp('.*'+name+'.*')}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                }
                else if(name == '') {
                    //根据债券代码code来搜索。
                    if(type == 1) {
                        collection.find({'Code': new RegExp('.*'+code+'.*'), 'Exchange': 'GZ'}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                    else if(type == 2) {
                        collection.find({'Code': new RegExp('.*'+code+'.*'), 'Exchange': 'SH'}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                    else if(type == 3) {
                        collection.find({'Code': new RegExp('.*'+code+'.*'), 'Exchange': 'SZ'}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                    else {
                        collection.find({'Code': new RegExp('.*'+code+'.*')}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                }
                else {
                    //根据两个条件做交集搜索。
                    if(type == 1) {
                        collection.find({'Code': new RegExp('.*'+code+'.*'), 'Name': new RegExp('.*'+name+'.*'), 'Exchange': 'GZ'}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                    else if(type == 2) {
                        collection.find({'Code': new RegExp('.*'+code+'.*'), 'Name': new RegExp('.*'+name+'.*'), 'Exchange': 'SH'}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                    else if(type == 3) {
                        collection.find({'Code': new RegExp('.*'+code+'.*'), 'Name': new RegExp('.*'+name+'.*'), 'Exchange': 'SZ'}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                    else {
                        collection.find({'Code': new RegExp('.*'+code+'.*'), 'Name': name}).toArray(function(err, result) {
                            if(err)
                                reject(err);
                            else {
                                resolve(result);
                            }
                        });
                    }
                }
            }
        });
    });
};

var searchData = async function(url, code, name, type, res) {
    var result = {};
    if(type == 0) {
        var data1 = await searchOneCollection(url, code, '1', name);
        var data2 = await searchOneCollection(url, code, '2', name);
        var data3 = await searchOneCollection(url, code, '3', name);
        var data4 = await searchOneCollection(url, code, '4', name);
        var data5 = await searchOneCollection(url, code, '5', name);
        result = {
            '国债数据': data1,
            '沪企债': data2,
            '深企债': data3,
            '中债VaR': data4,
            '中债估值': data5
        };
    }
    else {
        var data = await searchOneCollection(url, code, String(type), name);
        result = data;
    }
    res.send(result);
};



module.exports.getNewsData = getNewsData;
module.exports.getBondsData = getBondsData;
module.exports.getExcel = getExcel;
module.exports.getDetailData = getDetailData;
module.exports.getZZValuation = getZZValuation;
module.exports.getZZVaR = getZZVaR;
module.exports.verifyLogin = verifyLogin;
module.exports.verifyCookie = verifyCookie;
module.exports.searchData = searchData;