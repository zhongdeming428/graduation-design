var MongoClient = require('mongodb').MongoClient;
var DB = {
    '1': 'ChinaBonds',
    '2': 'AmericaBonds',
    '3': 'SHIBOR',
    '4': 'LIBOR'
};


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
                collection.find({'Date': new RegExp(year + '/.+')}).sort({'Date':-1}).toArray(function(err, result) {
                    if(err)
                        res.status(500).send(err);
                    var data = {};
                    data.data = result;
                    collection.distinct('Date').then(dates => {
                        var datesRes = [];
                        dates.forEach(date => {
                            date = date.replace('-', '/');
                            var temp = date.substring(0, date.indexOf('/'));
                            if(datesRes.indexOf(temp) < 0)
                                datesRes.push(temp);
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
            collection.find({'Date':new RegExp(year + '.+')}).sort({'Date': -1}).toArray(function(err, result) {
                if(err)
                    res.status(500).send(err);
                var data = {};
                data.data = result;
                collection.distinct('Date').then(dates => {
                    var datesRes = [];
                    dates.forEach(date => {
                        date = date.replace('-', '/');
                        var temp = date.substring(0, date.indexOf('/'));
                        if(datesRes.indexOf(temp) < 0)
                            datesRes.push(temp);
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
}

module.exports.getNewsData = getNewsData;
module.exports.getBondsData = getBondsData;