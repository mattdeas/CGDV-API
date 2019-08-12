'use strict';

/**
 * Module dependencies.
 */
const config = require('../config/config'),
  express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  expressValidator = require('express-validator'),
  helmet = require('helmet'),
  path = require('path'),
  _ = require('lodash'),
  Boom = require('../languages/en/errors'),
  logger = require('./logger'),
  winston = require('winston'),
  expressWinston = require('express-winston'),
  helper = require('../common/helper'),
  compression = require('compression');


/**
 * Initialize global variables
 */
module.exports.initGlobalVariables = function (app) {
  // Setting application local variables
  global.rootPath = path.dirname(process.mainModule.filename);

};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {

  app.use(compression());
  app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(expressValidator({
  customValidators: {
    isArray: function(value) {
      return Array.isArray(value);
    },
    isString: function(value){
      if (typeof value === 'string') {
        return true;
      } else {
        return false;
      }
    },
    lessThan: (value, options) => {
      options = options || {}
      if (options.compareTo) {
        return parseInt(value, 10) < parseInt(options.compareTo, 10)
      }
      return false
    }
  }
}));
  app.use(cookieParser());
  app.use(this.allowCrossDomain);
  // Create unique request id
  app.use(function(req, res, next) {
    req.id = helper.randomString(16);
    if(req.method === 'OPTIONS'){
      return res.send();
    }
    next()
  })
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard({
  action: 'allow-from',
  domain: 'http://172.16.16.154:4200'
}));
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Allowing X-domain request
 */
module.exports.allowCrossDomain = function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, x-access-token, Pragma, Origin, Content-Type, X-Requested-With, content-type, X-Frame-Options");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  return next();
};

/**
 * Configure logger
 */
module.exports.initLogger = function(app, req){
  //app.use(require("morgan")("combined", { "stream": logger.stream }));
  //app.use(require("morgan")('combined'));
  app.use(require("morgan") ("combined", logger.getMorganOptions(req) ));
  //app.set('logger', logger);
}

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
  // Setting the app router and static folder
  app.use('/', express.static(path.resolve('./public')));

};

/**
 * Configure the modules server routes
 */
module.exports.initServerRoutes = function (app) {
  // Globbing routing files
  require(path.resolve('modules/auth/routes/auth'))(app);
  require(path.resolve('modules/password/routes/password'))(app);
  require(path.resolve('modules/user/routes/user'))(app);
  require(path.resolve('modules/common/routes/common'))(app); 
  require(path.resolve('modules/country/routes/country'))(app);
  require(path.resolve('modules/university/routes/university'))(app);
  require(path.resolve('modules/category/routes/category'))(app);
  require(path.resolve('modules/visual/routes/visual'))(app);
  require(path.resolve('modules/video/routes/video'))(app);
  require(path.resolve('modules/cms/routes/cms'))(app);
  require(path.resolve('modules/challenge/routes/challenge'))(app);
  require(path.resolve('modules/statistics/routes/statistics'))(app);

  //  All undefined URL will call this function
  // app.all('/*', function (req, res) {
  //   return res.status(Boom.NOT_IMPLEMENTED.statusCode).json(Boom.NOT_IMPLEMENTED);
  //   // res.sendFile(path.join(__dirname, 'public/index.html'));
  // });

};

/**
 * Configure error handling
 */
module.exports.initError = function (app) {

  if (config.logs.error) {

    expressWinston.requestWhitelist.push('body');

    app.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ],
      msg: "{{req.id}} || {{req.method}} || {{req.url}}",
    }));
  }

  // development error handler
  // will print stacktrace
  if (process.env.NODE_ENV === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(500).json({status: 0, statusCode : 500, message: 'Something went wrong', result: err.stack});
    });
  } else {
    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(500).send({status: 0,  statusCode : 500, message: 'Something went wrong'});
    });
  }

};
/**
 * Configure Swagger routes
 */
module.exports.initSwaggerRoutes = function (app) {
  // swagger link
  require('../swagger/swagger')(app);

};

/**
 * Configure test coverage routes
 */
module.exports.initTestCoverageRoutes = function (app) {
  // coverage link
  app.use('/coverage', express.static(__dirname + '/../coverage/lcov-report'));

};


/**
 * Initialize the Express application
 */
module.exports.init = function (db) {

  // Initialize express app
  var app = express();

  // Initialize local variables
  this.initGlobalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize Logger
  this.initLogger(app);
  
  // Initialize Swagger
  this.initSwaggerRoutes(app);

  // Initialize test coverage route
  this.initTestCoverageRoutes(app);
  

  // Initialize modules static client routes, before session!
  this.initModulesClientRoutes(app);

  // Initialize modules server routes
  this.initServerRoutes(app);

  // Initialize error routes
  this.initError(app);



  return app;
};
