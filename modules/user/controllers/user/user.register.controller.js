'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  config = require(path.resolve('config/config')),
  pool = require(path.resolve('lib/db')),
  helper = require(path.resolve('common/helper')),
  async = require('async'),
  mail = require(path.resolve('mail/mail')),
  jwt = require('jsonwebtoken'),
  Boom = require(path.resolve('languages/en/errors')),
  Session = require(path.resolve('models/Session')),
  User = require(path.resolve('models/User'));

/**
 *  Register user by admin
 *  
 *  Function purpose :
 *   => New user register by admin
 *   => Api can access by admin only 
 *
 *  Flow :: Check Email not already exists
 *          create user
 *
 */
exports.userRegister = function (req, res, next) {
  // Define default parameters
  req.body.type = 1;  //  For end user  
  req.body.status = 1; // by default  Active 
  req.body.is_manual = 1; // registered manually  
  req.body.email = req.body.email.toLowerCase();

  // encrypt password
  req.body.password = helper.encrypt(req.body.password);

  // Connect Database
  pool.connect(function (err, client, done) {

    // if database connection error occured
    if (err) {
      console.log(err)
      done(); // close connection
      return res.status(Boom.SERVICE_UNAVAILABLE.statusCode).json(Boom.SERVICE_UNAVAILABLE);
    }

    async.waterfall([
      dbBegin,
      checkEmailExists,
      userRegister,
      // login,
      dbCommit,
      success
    ], function(err) {
      pool.rollback(client, done);
      next(err);
    });


    function dbBegin(callback) {
      client.query('BEGIN', function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
    // Check email is unique or not
    function checkEmailExists(callback) {
      User.checkEmailExist(req.body.email, function(err, results) {
        if (err) {
          callback(err);
        } else if (results.length) {
          pool.rollback(client, done);
          return res.status(Boom.EMAIL_EXISTS.statusCode).json(Boom.EMAIL_EXISTS);
        } else {
          callback(null);
        }
      });
    }

    function userRegister(callback) {
      User.userRegister(client, req.body, function(err, results) {
        if (err) {
          callback(err);
        } else {
          callback(null, results[0].id);
        }
      });
    }

    function login(user_id, callback){

      var tokenPayload = {
        id: user_id,
        firstname: req.body.firstname || null,
        lastname: req.body.lastname || null,
        avatar: 'storage/default.jpeg',
        type: req.body.type
      }

      // Create json token and send to user
      var result = {
        firstname: req.body.firstname || null,
        lastname: req.body.lastname || null,
        avatar: 'storage/default.jpeg',
        tc_accepted: 1,
        token: jwt.sign(tokenPayload, config.key.privateKey, { expiresIn: config.key.tokenExpiry })
      };

      // Decode token
      var decoded = jwt.decode(result.token);


      // Prepare data for store in session
      var data = {
        user_id: user_id,
        token: result.token,
        created_time: decoded.iat,
        exp_time: decoded.exp,
        meta: tokenPayload,
      };

      Session.store(client, data, function (err) {
        if (err) {
          console.log(err)
          pool.rollback(client, done);
          return res.status(Boom.SOMETHING_WRONG.statusCode).json(Boom.SOMETHING_WRONG);
        } else {
          callback(null, result);
        }
      });
    }

    function dbCommit(result, callback) {
      client.query('COMMIT', function(err) {
        if (err) {
          callback(err);
        } else {
          done();
          callback(null, result);
        }
      });
    }

    function success(result, callback) {
      // sendParentRegistrationMail(req.body.email);
      return res.json({ status: 1, message: 'Joined successfully', result: result });
    }

  }); // End connection pool

function sendParentRegistrationMail(email) {
    var data = {
      email: email,
    };
    mail.sentParentRegistration(data, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Registration mail send success');
      }
    });
  }


}; // End 
