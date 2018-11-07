'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Session = require(path.resolve('models/Session'));

/*
* 
* Function purpose :
    => Admin Or publisher login
    => Api can access by all users
*/
exports.logout = (req, res, next) => {

	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	console.log('token',token)
	// Delete session by access token
	Session.deleteByToken(false, token, function(err){
		if (err){
			next(err);
		} else {
			res.send({ status: 1, message: 'Success' });
		}
	});

}; // End logout