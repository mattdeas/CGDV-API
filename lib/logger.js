'use strict';

var config = require('../config/config'),
  winston = require('winston'),
  path = require('path'),
  fs = require('fs'),
  logDir = path.resolve('logs');
if(!fs.existsSync(logDir)){
  fs.mkdirSync(logDir)
}
var getDebugStorage = function () {
  var storage;
  // Define debug storage
  if (config.logs.activity) {
    storage = new winston.transports.File({ 
      filename: logDir+'/debug.log',
      maxsize:'5000000', 
      timestamp:true,
      json: true
    })
  } else {
    storage = new (winston.transports.Console)({
      colorize: true,
      prettyPrint: true,
      json: true
    });
  }
  return storage;
};

var getExceptionStorage = function () {
  var storage;
  // Define debug storage
  if (config.logs.exception) {
    storage = new winston.transports.File({ 
      filename: logDir+'/exeption.log',
      maxsize:'5000000', 
      timestamp:true,
      json: true
    })
  } else {
    storage = new (winston.transports.Console)({
      level: 'debug',
      colorize: true,
      prettyPrint: true
    });
  }
  return storage;
};



//  Initialize logger for debug log
var logger = new (winston.Logger)({
  transports: [
    getDebugStorage()
  ],
  handleExceptions: config.logs.exception,
  exceptionHandlers: [
    getExceptionStorage()
  ],
  exitOnError: false
});


// A stream object with a write function that will call the built-in winston
// logger.info() function.
// Useful for integrating with stream-related mechanism like Morgan's stream
// option to log all HTTP requests to a file
logger.stream = {
  write: function(msg) {
    logger.info(msg);
  }
};
// Create function for log and set logging parameter
logger.logging = (msg, req) => {
  logger.info(
    msg,
    {
      'reqId': req.id || '',
      'user_id': req.user ? req.user.id : '',
      'ip': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      'url': req.originalUrl || '',
      'method': req.method || '',
      'session_id': req.session ? req.session.id : '',
      'params': req.body || req.params || '',
      'session_data': req.session || '',
      'headers': req.headers || ''
    }
 );
}

/**
 * The options to use with morgan logger
 *
 * Returns a log.options object with a writable stream based on winston
 * file logging transport (if available)
 */
logger.getMorganOptions = function getMorganOptions(req) {

  return {
    stream: logger.stream,
    skip: function (req) {
        var ext = path.extname(req.originalUrl);
        if (ext) {
          return true;
        } else {
          return false;
        }
      }
  };

};

module.exports = logger;
