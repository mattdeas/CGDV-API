'use strict';

/**
 * Module dependencies
 */
const validate = require('../validate/authValidate'),
  path = require('path'),
  stratagy = require(path.resolve('modules/stratagy'));

module.exports = function (app) {

  // Auth Controller
  var auth = require('../controllers/authController');

  app.route('/api/auth/user/register')
        .post(            
            validate.register,
            auth.register
        );

  app.route('/api/auth/:type(user|admin)/login')
    .post(
            validate.login,
            auth.login
          );
   app.route('/api/auth/:type(user|admin)/socialSignIn')
    .post(
            validate.socialSignIn,
            auth.socialSignIn
          );
  app.route('/api/auth/logout')
    .post(
            auth.logout
          );

};

