'use strict';

/**
 * Module dependencies.
 */
var config = require('../config/config'),
  express = require('./express'),
  chalk = require('chalk'),
  fs = require('fs'),
  http = require('http'),
  https = require('https');

module.exports.init = function init(callback) {    
    var app = express.init();
    // if (callback) callback(app, config);
    return {app: app, config: config}
};
