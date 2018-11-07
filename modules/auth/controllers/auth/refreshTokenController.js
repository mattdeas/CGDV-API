'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  config = require(path.resolve('config/config')),
  jwt = require('jsonwebtoken'),
  Session = require(path.resolve('models/Session'));

/*
*
* Note :: This api currently unavailable
*
* 
* Function purpose :
    => Admin, publisher, Parent or Child can refresh token by old access token
    => Api can access by All user
*/
exports.refreshToken = function (req, res, next) {

  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  // Decode token
  let tokenPayload = jwt.decode(token);

  // Delete token start and exp time
  delete tokenPayload.iat
  delete tokenPayload.exp

  let newToken = jwt.sign(tokenPayload, config.key.privateKey, { expiresIn: config.key.tokenExpiry })

  // Decode new token
  let decoded = jwt.decode(newToken);


  // Prepare data for store in session
  let data = {
    user_id: tokenPayload.id,
    token: newToken,
    created_time: decoded.iat,
    exp_time: decoded.exp,
    meta: tokenPayload,
  };

  // Delete old session in database
  Session.deleteByToken(false, token, function(err){
    if(err){
      console.log(err);
    }
  });

  // Store new session data in database
  Session.store(false, data, function (err) {
    if (err) {
      next(err)
    } else {
      return res.json({ status: 1, message: 'Token refreshed.', result: newToken });
    }
  });
}; // End refreshToken

