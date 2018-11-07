'use strict';

exports.checkImage = function (req, res, next) {

  const schema = {
    'image': {
      notEmpty: true,
      errorMessage: 'image is required'
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
