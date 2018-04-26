var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); 

var getNewsData = require('./FetchDB').getNewsData;
var getBondsData = require('./FetchDB').getBondsData;

var url = "mongodb://localhost:27017";

app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var upload = multer({ dest: './uploads' });

app.get('/News', function(req, res) {
    getNewsData(url, res);
});

app.post('/BondsData', function(req, res) {
    var type = req.body.type;
    var year = req.body.year ? req.body.year : null;
    getBondsData(url, type, year, res);
})

app.listen(8000);
console.log('Node服务器正在监听8000端口 ... ...');