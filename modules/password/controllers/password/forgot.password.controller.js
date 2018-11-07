'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  pool = require(path.resolve('lib/db')),
  async = require('async'),
  Boom = require(path.resolve('languages/en/errors')),
  helper = require(path.resolve('common/helper')),
  mail = require(path.resolve('mail/mail')),
  User = require(path.resolve('models/User')),
  ResetPassword = require(path.resolve('models/ResetPassword'));


/*
 * Admin or user can request forgot password with email
 *
 * @params :: email
 *
 *  Flow :: Check admin or user exist
 *          Generate and add token in reset_password table
 *          Token send via email
 *
 *
 */
exports.forgot = function (req, res, next) {

  var email = req.body.email;
  var token = helper.randomString(60);
  console.log('forgot',email)
    // Connect Database
  pool.connect(function (err, client, done) {

    // if database connection error occured
    if (err) {
      done(); // close connection
      return res.status(Boom.SERVICE_UNAVAILABLE.statusCode).json(Boom.SERVICE_UNAVAILABLE);
    }

    async.waterfall([
      dbBegin,
      checkEmail,
      addToken,
      sentResetPasswordLink,
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

    function checkEmail(callback) {
      User.checkEmail(email, function(err, results) {
        if (err) {
          callback(err);
        } else if (!results.length) {
          pool.rollback(client, done);
          return res.status(Boom.EMAIL_NOT_REGISTERED_WITH_US.statusCode).json(Boom.EMAIL_NOT_REGISTERED_WITH_US);
        } else {
          callback(null, results[0]);
        }
      });
    }

    function addToken(user, callback) {
      ResetPassword.addToken(client, user.id, token, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, user);
        }
      });
    }

    function sentResetPasswordLink(user, callback) {
      var data = {
        email: user.email,
        name: user.firstname || '',
        token: token
      };
      mail.sentResetPasswordLink(data, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }

    function dbCommit(callback) {
      client.query('COMMIT', function(err) {
        if (err) {
          callback(err);
        } else {
          done();
          callback(null);
        }
      });
    }

    function success(callback) {
      res.send({ status: 1, message: 'Email sent successfully!' });
    }

  }); // End connection pool

}; // End 
