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
  User = require(path.resolve('models/User'));

/**
 * updateUserProfile
 */
exports.updateUserProfile = function (req, res, next) {
  
  req.body.email = req.body && req.body.email ? req.body.email.toLowerCase() : req.body.email;
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
      updateUser,
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
    
    function chekcUserExists(callback) {
      User.chekcUserExists(req.params.id, function(err, results) {
        if (err) {
          callback(err);
        } else if (!results.length) {
          pool.rollback(client, done);
          return res.status(Boom.NO_DATA_FOUND.statusCode).json(Boom.NO_DATA_FOUND);
        } else {
          callback(null);
        }
      });
    }

    function updateUser(callback) {
      User.updateUser(client, req.body, function(err, results) {
        if (err) {
          callback(err);
        } else {
          console.log('results',results)
          callback(null, results);
        }
      });
    }    

    function dbCommit(result, callback) {
      console.log('result',result)
      client.query('COMMIT', function(err) {
        if (err) {
          callback(err);
        } else {
          done();
          callback(null, result.rows[0]);
        }
      });
    }

    function success(result, callback) {
      return res.json({ status: 1, message: 'Updated successfully', data: result});
    }

  }); // End connection pool
}