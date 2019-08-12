'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
    Visual = require(path.resolve('models/Visual')),
    pool = require(path.resolve('lib/db')),
    async = require('async'), 
    helper = require(path.resolve('common/helper')),
    Boom = require(path.resolve('languages/en/errors'));


exports.upvote = function (req, res, next) {  
  
  let viz_id = req.body.viz_id;
  let user_id = req.user ? req.user.id : null;
  console.log('user_id',user_id,req.user)
  async.waterfall([
      chekcVisualExists,
      checkNUpvoteVisual,
      createUpvote,
      updateVisualVote,
      success
    ], function(err) {
      next(err);
    });


    function chekcVisualExists(callback) {
      console.log("chekcVisualExists");
      console.log("viz_id",viz_id);
      Visual.getVisualById(viz_id, function(err, results) {
        if (err) {
          callback(err);
        } else if (!results.length) {
          return res.status(Boom.NO_DATA_FOUND.statusCode).json(Boom.NO_DATA_FOUND);
        } else {
          callback(null);
        }
      });
    }

    function checkNUpvoteVisual(callback) {
      console.log("checkNUpvoteVisual");
      if(user_id){
        Visual.getUpvoteById(user_id, viz_id, function(err, results) {
              if (err) {
                  next(err);
              } else if (results.length) {
                  return res.status(Boom.ALREADY_VOTED.statusCode).json(Boom.ALREADY_VOTED);
              } else {                
                  callback(null, user_id, viz_id);
              }
        });
      }else{
        callback(null, null, null);
      }
    }

    function createUpvote(user_id, viz_id, callback) {
      if(user_id){
        Visual.createUpvote(user_id, viz_id, function(err, results) {
          if (err) {
            callback(err);
          } else {
            callback(null, results[0]);
          }
        });
      }else{
        callback(null, null);
      }
    }

    function updateVisualVote(result, callback) {
      Visual.updateVisualVote(viz_id, function(err, results) {
        if (err) {
          callback(err);
        } else {
          console.log('results',results)
          callback(null, results.rows);
        }
      });
    }    

    function success(result, callback) {
      return res.json({ status: 1, message: 'Voted successfully', data:result});
    }
}