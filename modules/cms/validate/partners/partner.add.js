'use strict';
const path = require('path'),
      _ = require('lodash'),
      Boom = require(path.resolve('languages/en/errors'));
exports.addPartner = function (req, res, next) {

  const schema = {
    'avatar': {
      notEmpty: true,
      errorMessage: 'avatar is required.'
    },
    'title': {
      notEmpty: true,
      errorMessage: 'title is required.'
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
