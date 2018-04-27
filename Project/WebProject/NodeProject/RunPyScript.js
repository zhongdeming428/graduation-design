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

// fitYieldCurve('2', '2006/01/13')
exports.fitYieldCurve = fitYieldCurve;