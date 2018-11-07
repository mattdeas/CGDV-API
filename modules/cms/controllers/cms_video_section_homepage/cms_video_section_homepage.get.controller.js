'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Cms = require(path.resolve('models/Cms')),
  async = require('async'),
  Boom = require(path.resolve('languages/en/errors'));



exports.getHomepageVideoSection = function (req, res, next) {  
  Cms.getHomepageVideoSection(function (err, result) {
        if (err) {
          next(err);
        } else {
          let message,status;
          console.log(result)
          if(result && result.length){
            status = 1;
            message = 'Success';
          } else {
            status = 0;
            message = 'No Data found';
          }
          res.json({ status: status, message: message, result: result });
        }
  });  
}; // End 
