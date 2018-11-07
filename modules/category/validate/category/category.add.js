'use strict';
const path = require('path'),
      _ = require('lodash'),
      Boom = require(path.resolve('languages/en/errors'));
exports.categoryAdd = function (req, res, next) {

  const schema = {
    'name': {
      notEmpty: true,
      errorMessage: 'name is required.',      
      isLength: {
        options: [{ max: 128 }],
        errorMessage: 'name length should not be greater than 128 characters.'
      }
    },
    'type': {
      notEmpty: true,
      errorMessage: 'type is required.',      
      isLength: {
        options: [{ max: 128 }],
        errorMessage: 'type length should not be greater than 128 characters.'
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
