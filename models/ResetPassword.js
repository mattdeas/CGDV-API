'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
	pool = require(path.resolve('lib/db'));


/*
 * Model call from password/forgot.password.controller
 *
*/
exports.addToken = function(client, user_id, token, callback){

	this.removeResetPasswordToken(client, user_id, function(err){
		if(err){
			callback(err);
		} else {
			var query = 'INSERT INTO reset_passwords(user_id, token, created_at) VALUES ( $1, $2, NOW() )';
			client.query(query,[user_id, token], function(err){
				if(err){
					callback(err);
				} else {
					callback(null);
				}
			});
		}
	})
}


/*
 * Model call from password/reset.password.controller
 *								 same file in addToken function
 *
*/
exports.removeResetPasswordToken = function(client, user_id, callback){

	var query = 'DELETE FROM reset_passwords WHERE user_id=$1';
	client.query(query,[user_id], function(err){
		if(err){
			callback(err);
		} else {
			callback(null);
		}
	});
}


/*
 * Model call from password/reset.password.controller
 *								 password/verifyOTP.controller
 *
*/
exports.checkResetPasswordToken = function(token, callback){

	var query = `SELECT *,
					DATE_PART ('minute', NOW() - created_at ) AS minutes
				FROM
					reset_passwords
				WHERE
					token=$1
				ORDER BY id DESC`;
	pool.query(query,[token], function(err, result){
		if(err){
			callback(err);
		} else {
			callback(null, result.rows);
		}
	});
}