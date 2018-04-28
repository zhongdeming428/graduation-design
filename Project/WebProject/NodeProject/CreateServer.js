var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var getNewsData = require('./FetchDB').getNewsData;
var getBondsData = require('./FetchDB').getBondsData;
var getExcel = require('./FetchDB').getExcel;
var getDetailData = require('./FetchDB').getDetailData;
var fitYieldCurve = require('./RunPyScript').fitYieldCurve;
var getZZValuation = require('./FetchDB').getZZValuation;
var getZZVaR = require('./FetchDB').getZZVaR;

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

app.get('/Download', function(req, res) {
    var type = req.query.type;
    if (+type > 3) {
        res.status(404).end();
    }
    var year = req.query.year;
    var path = getExcel(type, year);
    res.download(path);
});

app.get('/DetailData', function(req, res) {
    var type = req.query.type;
    if(type == null)
        res.status(400).send('type参数不能为空！');
    getDetailData(url, type, res);
});

app.get('/YieldCurve', function(req, res) {
    var type = req.query.type;
    var date = req.query.date;
    if(type == null || date == null) {
        res.status(400).send('参数不能为空！');
    }
    fitYieldCurve(type, date, res);
});

app.get('/ZZValuation', function(req, res) {
    getZZValuation(url, res);
});

app.get('/ZZVaR', function(req, res) {
    getZZVaR(url, res);
})

app.listen(8000);
console.log('Node服务器正在监听8000端口 ... ...');