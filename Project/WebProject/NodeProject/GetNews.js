var MongoClient = require('mongodb').MongoClient;

function getData(url) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function(err, dbo) {
            if (err) reject(err);
            var db = dbo.db('BondsData');
            var collection = db.collection('News');
            collection.find().sort({UpdateTime:-1}).limit(10).toArray((err, res) => {
                if(err)
                    reject(err)
                console.log(res);
                resolve(res)
            });
            dbo.close();
        });
    })
}

async function GetNews(url) {
    var data = await getData(url);
    return data;
}

module.exports.GetNews = GetNews;