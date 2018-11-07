'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  async = require('async'),
  Boom = require(path.resolve('languages/en/errors')),
  helper = require(path.resolve('common/helper')),
  User = require(path.resolve('models/User'));

/**
 *  Admin can change all user's password
 *  All user can change password itselt
 *
 *  @params ::  password, new_password
 *
 *  Flow :: Check old password
 *          Update user password
 *
 *
 */
exports.change = function (req, res, next) {

  let user_id = '';
  if (req.params.type && req.params.type === 'admin') {
    user_id = req.params.id;
  } else {
    user_id = req.user.id;
  }

  let new_password = helper.encrypt(req.body.new_password);

  async.waterfall([
    checkOldPassword,
    updatePassword,
    success
  ], function (err) {
    next(err);
  });

  function checkOldPassword(callback) {

    if (req.params.type && req.params.type === 'admin') {
      callback(null);
    } else {
      User.getUserById(user_id, function (err, results) {
        if (err) {
          callback(err);
        } else if (!results.length) {
          return res.status(Boom.INVALID_CURRENT_PASSWORD.statusCode).json(Boom.INVALID_CURRENT_PASSWORD);
        } else if (!helper.validPassword(req.body.current_password, results[0].password)) {
          return res.status(Boom.INVALID_CURRENT_PASSWORD.statusCode).json(Boom.INVALID_CURRENT_PASSWORD);
        } else {
          callback(null);
        }
      });
    }
  }

  function updatePassword(callback) {
    User.updatePassword(false, user_id, new_password, function (err, results) {
      if (err) {
        callback(err);
      } else if (!results.rowCount) {
        return res.status(Boom.SOMETHING_WRONG.statusCode).json(Boom.SOMETHING_WRONG);
      } else {
        callback(null);
      }
    });
  }

  function success(callback) {
    res.json({ status: 1, message: 'Your password has been reset successfully' });
  }

}; // End change
