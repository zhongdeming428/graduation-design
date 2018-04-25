var express = require('express');
var getData = require('./FetchDB').GetData

var url = "mongodb://localhost:27017";

app = express();

app.get('/News', function(req, res) {
    getData(url, res)
});

app.listen(8000);
console.log('Node服务器正在监听8000端口 ... ...');