var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017";

app = express();

app.get('/News', function(req, res) {
    MongoClient.connect(url, function(err, dbo) {
        if (err) console.log(err);
        var db = dbo.db('BondsData');
        var collection = db.collection('News');
        collection.find().sort({UpdateTime:-1}).limit(10).toArray((err, result) => {
            if(err)
                console.log(err)
            console.log('请求新闻公告数据成功！');
            res.send(result);
        });
        dbo.close();
    });
});

app.listen(8000);
console.log('Node服务器正在监听8000端口 ... ...');