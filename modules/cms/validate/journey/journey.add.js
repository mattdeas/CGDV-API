'use strict';

exports.addJourney = function (req, res, next) {

  const schema = {
    'nav_title': {
      notEmpty: true,
      errorMessage: 'Nav title is required.'
    },
    'header': {
      notEmpty: true,
      errorMessage: 'header is required.'
    },
    'content': {
      notEmpty: true,
      errorMessage: 'content is required.'
    },
    'avatar': {
      notEmpty: true,
      errorMessage: 'avatar is required.'
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
