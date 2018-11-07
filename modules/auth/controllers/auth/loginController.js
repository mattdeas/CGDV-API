'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  config = require(path.resolve('config/config')),
  jwt = require('jsonwebtoken'),
  helper = require(path.resolve('common/helper')),
  async = require('async'),
  logger = require(path.resolve('lib/logger')),
  Boom = require(path.resolve('languages/en/errors')),
  User = require(path.resolve('models/User')),
  Session = require(path.resolve('models/Session'));

/*
* 
* Function purpose :
    => Admin Or user login
    => Api can access by Admin or user
*/
exports.login = function (req, res, next) {

  logger.logging('login', req);

  // define requested variable
  var email = req.body.email.toLowerCase();
  var password = req.body.password;

  // Find user type base on request
  var roll = '';
  var url = req.url.trim('/');
  if (url === '/api/auth/admin/login') {
    roll = req.body.type ? req.body.type : 2; // Admin
  } else if (url === '/api/auth/user/login') {
    roll = 1; // User
  } else {
    return res.status(Boom.SOMETHING_WRONG.statusCode).json(Boom.SOMETHING_WRONG);
  }

  async.waterfall([
    function(callback) {
      // Check user exist or not
      User.getUserByEmail(email, roll, function(err, results) {
        if (err) {
          callback(err);
        } else if (!results.length) {
          return res.status(Boom.INVALID_EMAIL.statusCode).json(Boom.INVALID_EMAIL);
        } else {
          callback(null, results[0]);
        }
      });
    },
    function(user, callback) {
      // Check password match
      if (!helper.validPassword(password, user.password)) {
        return res.status(Boom.INVALID_CREDENTIAL.statusCode).json(Boom.INVALID_CREDENTIAL);
      }      
      // return if user is blocked except admin
      if (user.type !== 3) {
        // User is blocked
        if (user.status === 0) {
          console.log()
          return res.status(Boom.USER_BLOCKED.statusCode).json(Boom.USER_BLOCKED);          
        }
      }

      var tokenPayload = {
        id: user.id,        
        username: user.firstname + " " +user.lastname,
        avatar: user.avatar,
        type: user.type
      }


      // Create json token and send to user
      var result = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.firstname + " " +user.lastname,
        avatar: user.avatar,
        token: helper.generateJWT(tokenPayload)
      };
      return res.json({ status: 1, message: 'Logged in successfully.', result: result });
    }
  ], function(err) {
    next(err);
  });

}; // End login



/*
* 
* Function purpose :
    => Send success response if access token is valid
    => Api can access by all users
*/
exports.checkAuth = (req, res) => {
  res.send({ status: 1, message: 'Success' });
}; // End checkAuth
