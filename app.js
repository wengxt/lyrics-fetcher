var express = require('express');
var async = require('async');
var moefm = require('./moefm.js');
var kasitime = require('./kasitime.js');
var app = express();

function _firstSuccess(funcs, i, title, success, fail)
{
    funcs[i](title, function(err, result) {
        if (err) {
            if (i + 1 < funcs.length) {
                _firstSuccess(funcs, i + 1, title, success, fail);
            } else {
                if (fail) {
                    fail();
                }
            }
        } else {
            if (success) {
                success(result);
            }
        }
    });
}

function firstSuccess(funcs, title, success, fail)
{
    _firstSuccess(funcs, 0, title, success, fail);
}

app.get('/', function(req, res){
    function onerror() {
       res.send(404, 'Not Found');
    }

    if (req.query['title']) {
        var title = req.query['title'];
        var artist = req.query['artist'];
        firstSuccess([moefm, kasitime], {title : title, artist : artist}, function(lrc) {
            res.send(lrc);
        }, function() {
            res.send(404, "Not found");
        });
    } else {
        res.send(500, 'Invalid');
    }
});

var server = app.listen(3000, function() {
        console.log('Listening on port %d', server.address().port);
});
