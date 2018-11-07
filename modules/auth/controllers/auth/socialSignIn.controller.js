'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  config = require(path.resolve('config/config')),
  pool = require(path.resolve('lib/db')),
  helper = require(path.resolve('common/helper')),
  async = require('async'),
  mail = require(path.resolve('mail/mail')),
  jwt = require('jsonwebtoken'),
  Boom = require(path.resolve('languages/en/errors')),
  Session = require(path.resolve('models/Session')),
  User = require(path.resolve('models/User'));


/**
 *  Social sign in end user
 *  
 *  Function purpose :
 *   => user can sign in using social account google/facebook
 *
 *  Flow :: Check social account exists or not
 *           if exists ==> login
 *           if not exists ==> 
 *                Check Manual Register user with email exists
 *                    if exists ==> update social id ==> login
 *                    if not exists ==> create new user ==> login
 *
 */
exports.socialSignIn = function (req, res, next) {
  // Define default parameters
  req.body.type = 1;  //  For end user  
  req.body.status = 1; // by default  Active  
  req.body.email = req.body.email.toLowerCase();


  if(req.body.provider == 'google'){
    req.body.google_id = req.body.id;
  }

  if(req.body.provider == 'facebook'){
   req.body.facebook_id = req.body.id; 
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
      checkSocialExists,
      checkEmailExists,
      userRegister,
      login,
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
    // Check social login is exist or not
    function checkSocialExists(callback) {
      User.checkSocialExists(req.body, function(err, results) {
        if (err) {
          callback(err);
        } else if (results.length) {
          callback(null,results[0])
        } else {
          callback(null,null);
        }
      });
    }

    function checkEmailExists(user, callback) {
      
      var update_flag = false;
      if(user && user.id){
       callback(null, update_flag, user); 
      }else{ 
        User.checkEmailExist(req.body.email, function(err, results) {
          if (err) {
            callback(err);
          } else if (results.length) {
            update_flag = true;
            callback(null, update_flag, results[0])
          } else {
            update_flag = true;
            callback(null,update_flag, null);
          }
        });
      } 
    }

    function userRegister(update_flag, user, callback) {
      if(!update_flag && user.id){
       callback(null, user); 
      }else if(update_flag && user && user.id){
        req.body.id = user.id;
        User.updateSocial(client, req.body, function(err, results) {
          if (err) {
            callback(err);
          } else {
            callback(null, results[0]);
          }
        });
      }else if(update_flag){
        User.userRegister(client, req.body, function(err, results) {
          if (err) {
            callback(err);
          } else {
            callback(null, results[0]);
          }
        });
      }
    }

    function login(user, callback){
      var tokenPayload = {
        id: user.id,
        firstname: user.firstname || null,
        lastname: user.lastname || null,
        avatar: user.avatar,
        type: user.type
      }

      // Create json token and send to user
      var result = {
        id: user.id,
        firstname: user.firstname || null,
        lastname: user.lastname || null,
        avatar: user.avatar,
        tc_accepted: 1,
        token: helper.generateJWT(tokenPayload)
      };
      callback(null, result);      
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
      // sendParentRegistrationMail(req.body.email);
      return res.json({ status: 1, message: 'Logged in successfully.', result: result });
    }

  }); // End connection pool

function sendParentRegistrationMail(email) {
    var data = {
      email: email,
    };
    mail.sentParentRegistration(data, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Registration mail send success');
      }
    });
  }


}; // End 
