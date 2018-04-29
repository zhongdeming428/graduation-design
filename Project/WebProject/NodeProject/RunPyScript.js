var pyShell = require('python-shell');

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
    })
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

// fitYieldCurve('2', '2006/01/13')
// calculateVaR(1, '1,2,3', '', 0.95, 1, 1000)
exports.calculateVaR = calculateVaR;
exports.fitYieldCurve = fitYieldCurve;
exports.refreshAll = refreshAll;