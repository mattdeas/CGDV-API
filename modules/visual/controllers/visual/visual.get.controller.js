'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Visual = require(path.resolve('models/Visual')),
  helper = require(path.resolve('common/helper')),
  async = require('async'),
  Boom = require(path.resolve('languages/en/errors'));

/**
 * get visual list
 *
 *
 */
exports.getVisualList = function (req, res, next) {
  let loggedInUserId = req.user ? req.user.id : null; 
  req.query.loggedInUserId = loggedInUserId;
  async.parallel([
    function (callback) {
      Visual.visualSearchCount(req.query, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result[0]);
        }
      });
    },
    function (callback) {      
      Visual.getVisualList(req.query, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  ],
  function (err, results) {
    if (err) {
      next(err);
    } else {      
      var data = { };
      data.count = parseInt(results[0].total, 10);
      data.currentPage = req.query.page ? parseInt(req.query.page, 10) : 1;
      data.data = results[1];

      let message;
      if(!results[1].length){
        message = 'No Data found';
      } else {
        message = 'Success';
      }

      res.json({ status: 1, message: message, result: data });
    }
  });

}; // End 