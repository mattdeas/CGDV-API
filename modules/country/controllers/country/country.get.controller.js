'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Country = require(path.resolve('models/Country')),
  async = require('async'),
  Boom = require(path.resolve('languages/en/errors'));

  exports.getCountryListFORVIZ = function (req, res, next) {
  
    async.parallel([
      function (callback) {
        Country.countrySearchCount(req.query, function (err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result[0]);
          }
        });
      },
      function (callback) {      
        Country.getCountryFORVIZ(req.query, function (err, result) {
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
  
  };

exports.getCountryList = function (req, res, next) {
  
  async.parallel([
    function (callback) {
      Country.countrySearchCount(req.query, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result[0]);
        }
      });
    },
    function (callback) {      
      Country.getCountry(req.query, function (err, result) {
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