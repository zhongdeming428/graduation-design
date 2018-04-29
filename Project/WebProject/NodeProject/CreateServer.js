var express = require('express');
var bodyParser = require('body-parser');
var upload = require('jquery-file-upload-middleware');

var getNewsData = require('./FetchDB').getNewsData;
var getBondsData = require('./FetchDB').getBondsData;
var getExcel = require('./FetchDB').getExcel;
var getDetailData = require('./FetchDB').getDetailData;
var fitYieldCurve = require('./RunPyScript').fitYieldCurve;
var getZZValuation = require('./FetchDB').getZZValuation;
var getZZVaR = require('./FetchDB').getZZVaR;
var calculateVaR = require('./RunPyScript').calculateVaR;

var url = "mongodb://localhost:27017";

app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/Upload', upload.fileHandler());
upload.configure({
    uploadDir: __dirname + '/Uploads',
    uploadUrl: '/Uploads',
    imageVersions: {
        thumbnail: {
            width: 80,
            height: 80
        }
    }
});

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

app.post('/Uploads', function(req, res, next){
    upload.fileHandler({
        uploadDir: function () {
            return __dirname + '/Uploads/'
        },
        uploadUrl: function () {
            return '/Uploads'
        }
    })(req, res, next);
});

app.post('/CalculateVaR', function(req, res) {
    var type = req.body.type;
    var data = req.body.data;
    var file = req.body.file;
    var confidenceLevel = req.body.confidenceLevel;
    var holdingPeriod = req.body.holdingPeriod;
    var simCount = req.body.simCount;
    calculateVaR(type, data, file, confidenceLevel, holdingPeriod, simCount, res);
});

app.listen(8000);
console.log('Node服务器正在监听8000端口 ... ...');