'use strict';

exports.reset = function (req, res, next) {

  var schema = {
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
    res.status(Boom.VALIDATION_FAILED.statusCode).json(_.extend(Boom.VALIDATION_FAILED, {result: errors}));
  } else {
    next();
  }
};
