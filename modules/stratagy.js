'use strict';

const path = require('path'),
	Boom = require(path.resolve('languages/en/errors')),
	jwt = require('jsonwebtoken'),
	config = require(path.resolve('config/config')),
	Session = require(path.resolve('models/Session'));

function checkToken(req, res, types, callback){
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	// decode token
	if (token) {
		jwt.verify(token, config.key.privateKey, function (err, user) {
            if (err) {                
                return res.status(Boom.LOGIN_REQUIRED.statusCode).json(Boom.LOGIN_REQUIRED);
            } else {
            	let validType = types.indexOf(user.type) >= 0 ? 1 : 0;
				if (!validType){
					return res.status(Boom.NOT_ALLOWED.statusCode).json(Boom.NOT_ALLOWED);
				} else {
					req.user = user;
					callback(null);
				}
            }
        });	
  } else {
  	// return res.status(Boom.LOGIN_REQUIRED.statusCode).json(Boom.LOGIN_REQUIRED);
  	callback(' for isUserDataFound ');
  }

} // End checkToken

exports.isAuthorized = function(req, res, next){
	
	checkToken(req, res, [1,2,3], function(err){
		if(err){
			return res.status(Boom.LOGIN_REQUIRED.statusCode).json(Boom.LOGIN_REQUIRED);
		} else {
			next();
		}
	});

}; // End isAuthorized

exports.isUserDataFound = function(req, res, next){
	
	checkToken(req, res, [1,2,3], function(err){
		next();
	});

}; // End isUserDataFound

exports.isAdmin = function(req, res, next) {
	// parse admin type
	checkToken(req, res, [2,3], function(err){
		if(err){
			return res.status(Boom.LOGIN_REQUIRED.statusCode).json(Boom.LOGIN_REQUIRED);
		} else {
			next();
		}
	});
}; // End isAdmin

exports.isSuperAdmin = function(req, res, next) {
	// parse superadmin type
	checkToken(req, res, [3], function(err){
		if(err){
			return res.status(Boom.LOGIN_REQUIRED.statusCode).json(Boom.LOGIN_REQUIRED);
		} else {
			next();
		}
	});
}; // End isSuperAdmin