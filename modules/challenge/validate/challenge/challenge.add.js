'use strict';

exports.challengeAdd = function (req, res, next) {

  const schema = {
    'title': {
      notEmpty: true,
      errorMessage: 'title is required.',      
      isLength: {
        options: [{ max: 128 }],
        errorMessage: 'title length should not be greater than 128 characters.'
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
