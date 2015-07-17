'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mailClass = require('./mail.class');

var _mailClass2 = _interopRequireDefault(_mailClass);

var _configJson = require('../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _smtp = require('./smtp');

var _smtp2 = _interopRequireDefault(_smtp);

var _easyZip = require('easy-zip');

var _easyZip2 = _interopRequireDefault(_easyZip);

var Zip = _easyZip2['default'].EasyZip;
var base_dir = _path2['default'].resolve(_configJson2['default'].files.base);
var folders = _fs2['default'].readdirSync(base_dir);

function replaceAll(str, token, newtoken) {
    while (str.indexOf(token) !== -1) {
        str = str.replace(token, newtoken);
    }
    return str;
};

function csv2json(csv) {
    csv = replaceAll(csv, '\r', '');
    var lines = csv.split('\n');
    var result = [];
    var headers = lines.shift().split(';');
    lines.pop();

    lines.forEach(function (line) {
        line = line.split(';');
        var o = {};
        headers.forEach(function (prop, index) {
            o[prop] = line[index];
        });
        result.push(o);
    });

    return result;
}

function zipAttachment(attachments, cb) {
    attachments = attachments ? attachments.split(',') : [];
    var zip = new Zip();
    var p = attachments[0] || false;

    if (p) {
        (function () {
            var last_char = p[p.length - 1];
            var rnd = Math.round(Math.random() * 1000000);
            var zip_dir = _path2['default'].join(__dirname, '../tmp/' + rnd + '.zip');

            if ('\\' === last_char || '/' === last_char) {
                zip.zipFolder(p, function () {
                    return zip.writeToFile(zip_dir, function () {
                        if (cb) cb(zip_dir);
                    });
                });
            } else if (cb) cb(null);
        })();
    } else if (cb) cb(null);
}

function sendMailing(dir) {
    _fs2['default'].readFile(dir, 'utf-8', function (err, data) {
        var mailing = csv2json(data);

        mailing.forEach(function (opts) {
            opts.to = replaceAll(opts.to, ' ', '').split(',');

            zipAttachment(opts.attachments, function (zip_path) {
                var attach = zip_path ? [zip_path] : undefined;
                new _mailClass2['default'](_configJson2['default'].email.user, opts.to, opts.message, opts.subject, attach).send(_smtp2['default']);
            });
        });
    });
}

folders.forEach(function (folder) {
    var dir = _path2['default'].join(base_dir, folder + '/mailing.csv');
    sendMailing(dir);
});