'use strict';
const path = require('path'),
      _ = require('lodash'),
      Boom = require(path.resolve('languages/en/errors'));
exports.register = function (req, res, next) {

  const schema = {
    'email': {
      notEmpty: true,
      errorMessage: 'Email is required.',
      isEmail: {
        errorMessage: 'Please enter correct email id'
      },
      isLength: {
        options: [{ max: 128 }],
        errorMessage: 'Email length should not be greater than 128 characters.'
      }
    },
    'password': {
      notEmpty: true,
      errorMessage: 'Password is required.',
      isLength: {
        options: [{ min: 8, max: 64 }],
        errorMessage: 'Password length should be between 8 to 64 characters long.'
      }
    }
  };

  req.checkBody(schema);
  var errors = req.validationErrors();
  if (errors) {
    res.status(Boom.VALIDATION_FAILED.statusCode).json(_.extend(Boom.VALIDATION_FAILED, {result: errors}))
  } else {
    next();
  }
};
