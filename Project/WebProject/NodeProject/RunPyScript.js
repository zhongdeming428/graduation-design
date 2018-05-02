var pyShell = require('python-shell');
var csvParse = require('csv-parse');
const fs = require('fs');

var fitYieldCurve = function(type, date, response) {
    pyShell.run('F:\\graduation-design\\Project\\WebProject\\PythonProject\\FitYieldCurve.py', {
        args: [type, date]
    }, function(err, res) {
        if(err)
            console.log(err);
        else {
            res = res.filter(r => {
                return /Y\d+(\.\d+)?:\d+(\.\d+)?\r/g.test(String(r));
            });
            res = res.map(r => {
                return r.replace(/\r|Y/g, '');
            });
            var data = [];
            res.forEach(r => {
                data.push({year: r.split(':')[0], yield: r.split(':')[1]});
            });
            // console.log(res);
            response.send(data);
            response.end();
        }
    })
};

var calculateVaR = function(type, data, file, confidenceLevel, holdingPeriod, simCount, res) {
    if(type == 1) {
        data = data;
    }
    else if(type == 2) {
        data = __dirname + '\\Uploads\\' + file;
    }
    else {
        res.status(400).send('参数type的值不符合要求！');
    }
    pyShell.run('F:\\graduation-design\\Project\\WebProject\\PythonProject\\CalculateVaR.py', {
        args: [data, confidenceLevel, holdingPeriod, simCount]
    }, function(err, result) {
        if(err)
            res.status(500).send(err);
        else {
            // ...
            res.send(result[0].replace(/\r/g, ''));
            res.end();
        }
    });
};

var refreshAll = function(res) {
    pyShell.run('F:\\graduation-design\\Project\\WebProject\\PythonProject\\RefreshAll.py', function(err, result) {
        if(err)
            res.status(500).send(err);
        else {
            res.send('1');
        }
    });
};

var calculatePCA = function(type, data, file, componentCount, res) {
    if(type == 1) {
        data = data;
    }
    else if(type == 2) {
        data = __dirname + '\\data\\' + file;
    }
    else {
        res.status(400).send('type参数错误！');
    }
    pyShell.run('F:\\graduation-design\\Project\\WebProject\\PythonProject\\CalculatePCA.py', {
        args: [data, componentCount]
    }, function(err, result) {
        if(err) {
            res.status(500).send(err);
        }
        else {
            // ...
            var ratesPath = result[1].replace(/\r/g, '');
            var loadingPath = result[0].replace(/\r/g, '');
            var rates = fs.readFileSync(ratesPath, 'utf-8');
            var loadings = fs.readFileSync(loadingPath, 'utf-8');
            var ratesRows = rates.split('\n');
            rates = [];
            ratesRows.forEach((row, i) => {
                if(i < ratesRows.length - 1) {
                    row = row.split(',');
                    var obj = {};
                    obj['eigenVals'] = parseFloat(row[0]);
                    obj['rate'] = parseFloat(row[1]);
                    obj['culmulativeRate'] = parseFloat(row[2]);
                    rates.push(obj);
                }
            });
            var loadingRows = loadings.split('\n');
            loadings = [];
            loadingRows.forEach((row, i) => {
                if(i < loadingRows.length - 1) {
                    row = row.replace(/\r/g, '').split(',');
                    (function(row) {
                        var data = [];
                        row.forEach((r, i) => {
                            data.push(r);
                        });
                        loadings.push(data);
                    })(row);
                }
            });
            var obj = {
                rates, 
                loadings
            };
            res.send(obj);
        }
    });
};

// fitYieldCurve('2', '2006/01/13')
// calculateVaR(1, '1,2,3', '', 0.95, 1, 1000)
// calculatePCA(2, '', 'SHIBOR数据.csv', 3, null);
exports.calculateVaR = calculateVaR;
exports.fitYieldCurve = fitYieldCurve;
exports.refreshAll = refreshAll;
exports.calculatePCA = calculatePCA;