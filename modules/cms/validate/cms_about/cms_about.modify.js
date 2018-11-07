'use strict';

exports.updateAbout = function (req, res, next) {

  const schema = {
    'content': {
      notEmpty: true,
      errorMessage: 'content is required.'
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
