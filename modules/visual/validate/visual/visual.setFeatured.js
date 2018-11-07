'use strict';

exports.visualSetFeatured = function (req, res, next) {

  const schema = {
    'viz_id': {
      notEmpty: true,
      errorMessage: 'viz_id is required.'
    },
    'is_featured':{
      notEmpty: true,
      errorMessage: 'is_featured is required.'
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
