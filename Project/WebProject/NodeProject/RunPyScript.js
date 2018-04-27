var pyShell = require('python-shell');

var fitYieldCurve = function(type, date, response) {
    pyShell.run('F:\\graduation-design\\Project\\WebProject\\PythonProject\\FitYieldCurve.py', {
        args: [type, date]
    }, function(err, res) {
        if(err)
            console.log(err);
        else {
            res = res.filter(r => {
                r = r.replace(/\s/g, '');
                if(/^\d+(\.\d+)*$/g.test(r)) {
                    tmp = parseFloat(r);
                    if(tmp === tmp) {
                        return true;
                    }
                }
            });
            res = res.map(r => {
                return (+r.replace(/\s/g, '')).toFixed(4);
            });
            // console.log(res);
            response.send(res);
            response.end();
        }
    })
};


exports.fitYieldCurve = fitYieldCurve;