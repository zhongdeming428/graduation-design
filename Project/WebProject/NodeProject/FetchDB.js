var MongoClient = require('mongodb').MongoClient;

//用于获取新闻公告数据的函数。
var getData = function(url, res) {
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
}

module.exports.GetData = getData;