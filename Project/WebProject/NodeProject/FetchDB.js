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
            res.status(200).send(result)
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



module.exports.getNewsData = getNewsData;
module.exports.getBondsData = getBondsData;
module.exports.getExcel = getExcel;
module.exports.getDetailData = getDetailData;
module.exports.getZZValuation = getZZValuation;