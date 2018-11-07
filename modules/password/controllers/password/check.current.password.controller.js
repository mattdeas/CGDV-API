'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  User = require(path.resolve('models/User')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));

/**
 * Check current password before change password
 *
 *  @params ::  password
 *
 *  Flow :: Check current password is valid or not
 *
 */
exports.checkCurrentPassword = function (req, res, next) {

  let current_password = req.body.current_password || '';
  let user_id = req.user.id;

  User.getUserById(user_id, function (err, results) {
    if (err) {
      next(err);
    } else if (!results.length) {
      return res.status(Boom.INVALID_CURRENT_PASSWORD.statusCode).json(Boom.INVALID_CURRENT_PASSWORD);
    } else if (!helper.validPassword(current_password, results[0].password)) {
      return res.status(Boom.INVALID_CURRENT_PASSWORD.statusCode).json(Boom.INVALID_CURRENT_PASSWORD);
    } else {
      res.json({ status: 1, message: 'Success' });
    }
  });

}; // End checkCurrentPassword
