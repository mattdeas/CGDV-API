'use strict';
const path = require('path'),
      _ = require('lodash'),
      Boom = require(path.resolve('languages/en/errors'));
exports.login = function (req, res, next) {

  var schema = {
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
    }
  };

  req.checkBody(schema);
  var errors = req.validationErrors();
  if (errors) {
    res.status(Boom.VALIDATION_FAILED.statusCode).json(_.extend(Boom.VALIDATION_FAILED, {result: errors}));
  } else {
    next();
  }
};

