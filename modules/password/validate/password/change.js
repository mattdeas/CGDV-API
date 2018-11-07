'use strict';
var _ = require('lodash');

exports.change = function (req, res, next) {

  var schema = {
    'new_password': {
      notEmpty: true,
      errorMessage: 'New password is required.',
      isLength: {
        options: [{ min: 8, max: 64 }],
        errorMessage: 'New password length should be between 8 to 64 characters long.'
      }
    }
  };

  var current_password = {
    'current_password': {
      notEmpty: true,
      errorMessage: 'Current password is required.',
      isLength: {
        options: [{ min: 8, max: 64 }],
        errorMessage: 'Current password length should be between 8 to 64 characters long.'
      }
    }
  };


  if (req.params.type !== 'admin') {
    schema = _.merge(schema, current_password);
  }

  req.checkBody(schema);
  var errors = req.validationErrors();
  if (errors) {
    res.status(Boom.VALIDATION_FAILED.statusCode).json(_.extend(Boom.VALIDATION_FAILED, {result: errors}));
  } else {
    next();
  }
};
