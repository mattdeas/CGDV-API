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
  Video = require(path.resolve('models/Video'));

/**
 * updateVideo
 */
exports.updateVideo = function (req, res, next) {  
  
  req.body.id = req.params.id;
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
      chekcVideoExists,
      updateVideo,
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
    
    function chekcVideoExists(callback) {
      Video.chekcVideoExists(req.body.id, function(err, results) {
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

    function updateVideo(callback) {
      Video.updateVideo(client, req.body, function(err, results) {
        if (err) {
          callback(err);
        } else {
          callback(null, results[0]);
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
      return res.json({ status: 1, message: 'Updated successfully'});
    }

  }); // End connection pool
}


/**
 * setFeatured Video
 *
 *
 */
exports.setFeatured = function (req, res, next) {    
  Video.setFeatured(null, req.body, function (err, results) {
    if (err) {
      next(err);
    } else {    
      res.json({ status: 1, message: 'Success' });
    } 
  });

};