'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  pool = require(path.resolve('lib/db')),
  async = require('async'),
  Boom = require(path.resolve('languages/en/errors')),
  helper = require(path.resolve('common/helper')),
  User = require(path.resolve('models/User')),
  ResetPassword = require(path.resolve('models/ResetPassword'));

 /**
 * Admin, user can reset password By Token
 *
 *  @params ::  token, password
 *
 *  Flow :: Check  token is valid or not (60 min) from reset_password  table
 *          Update user password
 *          Remove token in reset_password  table
 *
 *
 */
exports.reset = function (req, res, next) {

  let token = req.body.token;
  let password = helper.encrypt(req.body.password);

  let errorMessage = Boom.INVALID_RESET_PASSWORD_TOKEN;

  // Connect Database
  pool.connect(function (err, client, done) {

    // if database connection error occured
    if (err) {
      done(); // close connection
      return res.status(Boom.SERVICE_UNAVAILABLE.statusCode).json(Boom.SERVICE_UNAVAILABLE);
    }

    async.waterfall([
      dbBegin,
      checkResetPasswordToken,
      updatePassword,
      removeResetPasswordToken,
      dbCommit,
      success
    ], function (err) {
      pool.rollback(client, done);
      next(err);
    });

    function dbBegin(callback) {
      client.query('BEGIN', function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }

    function checkResetPasswordToken(callback) {
      ResetPassword.checkResetPasswordToken(token, function (err, results) {
        if (err) {
          callback(err);
        } else if (!results.length) {
          pool.rollback(client, done);
          return res.status(errorMessage.statusCode).json(errorMessage);
        } else if (results[0].minutes > 60) {
          pool.rollback(client, done);
          return res.status(errorMessage.statusCode).json(errorMessage);
        } else {
          callback(null, results[0]);
        }
      });
    }

    function updatePassword(user, callback) {
      User.updatePassword(client, user.user_id, password, function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null, user);
        }
      });
    }

    function removeResetPasswordToken(user, callback) {
      ResetPassword.removeResetPasswordToken(client, user.user_id, function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }

    function dbCommit(callback) {
      client.query('COMMIT', function (err) {
        if (err) {
          callback(err);
        } else {
          done();
          callback(null);
        }
      });
    }

    function success(callback) {
      res.send({ status: 1, message: 'Password reset successfully' });
    }

  }); // End connection pool

}; // End reset
