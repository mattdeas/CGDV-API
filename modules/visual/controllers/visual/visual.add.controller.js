'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  config = require(path.resolve('config/config')),
  pool = require(path.resolve('lib/db')),
  helper = require(path.resolve('common/helper')),
  async = require('async'),  
  Boom = require(path.resolve('languages/en/errors')),
  User = require(path.resolve('models/User')),
  Visual = require(path.resolve('models/Visual'));
/**
 * Add Visual
 */
exports.VisualAdd = function (req, res, next) {  
  if(!req.body.user_id){
    req.body.user_id = req.user.id;
  }
  // Connect Database
  pool.connect(function (err, client, done) {

    // if database connection error occured
    if (err) {
      console.log(err)
      done(); // close connection
      return res.status(Boom.SERVICE_UNAVAILABLE.statusCode).json(Boom.SERVICE_UNAVAILABLE);
    }

    async.waterfall([
      dbBegin,
      chekcUserExists,
      addVisual,
      dbCommit,
      success
    ], function(err) {
      pool.rollback(client, done);
      next(err);
    });


    function dbBegin(callback) {
      client.query('BEGIN', function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
    // Check email is unique or not
    function chekcUserExists(callback) {
      User.chekcUserExists(req.body.user_id, function(err, results) {
        if (err) {
          callback(err);
        } else if (!results.length) {
          pool.rollback(client, done);
          return res.status(Boom.INVALID_ID.statusCode).json(Boom.INVALID_ID);
        } else {
          callback(null);
        }
      });
    }

    function addVisual(callback) {
      Visual.addVisual(client, req.body, function(err, results) {
        if (err) {
          callback(err);
        } else {
          callback(null, results[0].id);
        }
      });
    }
    
    function dbCommit(result, callback) {
      client.query('COMMIT', function(err) {
        if (err) {
          callback(err);
        } else {
          done();
          callback(null, result);
        }
      });
    }

    function success(result, callback) {
      return res.json({ status: 1, message: 'Added succesfully', result: result });
    }

  }); // End connection pool


}; // End 
