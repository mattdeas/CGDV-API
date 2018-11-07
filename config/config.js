'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  chalk = require('chalk'),
  glob = require('glob'),
  fs = require('fs'),
  path = require('path');


/**
 * Validate NODE_ENV existence
 */
var validateEnvironmentVariable = function () {
  var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log(chalk.white(''));
};

/**
 * Validate Secure=true parameter can actually be turned on
 * because it requires certs and key files to be available
 */
var validateSecureMode = function (config) {

  if (!config.server || config.server.secure !== true) {
    return true;
  }

  var privateKey = fs.existsSync(path.resolve(config.server.certificates.path + config.server.certificates.key));
  var certificate = fs.existsSync(path.resolve(config.server.certificates.path + config.server.certificates.crt));
  if (!privateKey || !certificate) {
    console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
    console.log();
    config.server.secure = false;
  }
};

/**
 * Validate Token Secret parameter
 */
var validatePrivateKey = function (config) {

  if (!config.key.privateKey) {
      console.log(chalk.red('+ WARNING: It is strongly recommended that you add privateKey config!'));
      console.log(chalk.red('  Please add `key.privateKey: process.env.KEY || \'super amazing key\'` to '));
      console.log(chalk.red('  `config/env/default.js`'));
      console.error(chalk.red('otherwise system will use default privateKey'));
      console.log();
      config.key.privateKey = 'nkwu87rmknlksdfbksj';
      return false;
  } else {
    return true;
  }
};


/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
  // Validate NODE_ENV existence
  validateEnvironmentVariable();


  // Get the default config
  var defaultConfig = require(path.join(process.cwd(), 'config/env/default'));
  // Get the current config
  var environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

  // Merge config files
  var config = _.merge(defaultConfig, environmentConfig);  

  // Validate Secure SSL mode can be used
  validateSecureMode(config);

  // Validate session secret
  validatePrivateKey(config);

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
