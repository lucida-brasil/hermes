'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var Mail = (function () {
    function Mail(sender, receivers, message) {
        var subject = arguments.length <= 3 || arguments[3] === undefined ? '(sem assunto)' : arguments[3];
        var attachments = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];
        var template = arguments.length <= 5 || arguments[5] === undefined ? 'default' : arguments[5];

        _classCallCheck(this, Mail);

        this.sender = sender;
        this.receivers = receivers;
        this.subject = subject;
        this.message = message;
        this.template = template + '.hbs';
        this.attachments = attachments;
    }

    _createClass(Mail, [{
        key: 'make',
        value: function make() {
            var dir = _path2['default'].resolve(__dirname, '../templates/');
            var source = _fs2['default'].readFileSync(_path2['default'].join(dir, this.template), 'utf-8');
            var template = _handlebars2['default'].compile(source);
            var html = template({
                message: this.message
            });
            var msg = {
                text: this.message,
                from: '"Hermes, O carteiro" <' + this.sender + '>',
                to: (this.receivers || []).join(','),
                subject: this.subject,
                attachment: [{ data: html, alternative: true }]
            };

            this.attachments.forEach(function (attach) {

                msg.attachment.push({
                    path: attach,
                    type: 'application/zip',
                    name: 'attachment-' + Math.round(Math.random() * 100000) + '.zip'
                });
            });

            return msg;
        }
    }, {
        key: 'send',
        value: function send(smtp) {
            var message = this.make();
            smtp.send(message, function (error, info) {
                if (error) return console.log(error);
                console.log('Message sent: ' + info);
            });
        }
    }]);

    return Mail;
})();

exports['default'] = Mail;
module.exports = exports['default'];