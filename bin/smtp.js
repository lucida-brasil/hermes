'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _configJson = require('../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _emailjsEmail = require('emailjs/email');

var _emailjsEmail2 = _interopRequireDefault(_emailjsEmail);

exports['default'] = _emailjsEmail2['default'].server.connect(_configJson2['default'].email);
module.exports = exports['default'];