'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
	pool = require(path.resolve('lib/db'));


/*
 * Model call from 
 *								 auth/loginController
 *
*/
exports.store = function(client, data, callback){

	let arr = [data.user_id, data.token, data.created_time, data.exp_time, data.meta];
	var query = `INSERT INTO
								sessions
									(user_id, token, created_time, exp_time, meta)
								VALUES
									($1, $2, $3, $4, $5)`	;
	if(client){
		client.query(query,arr, function(err, result){
			if(err){
				callback(err);
			} else {
				callback(null, result.rows);
			}
		});
	} else {
		pool.query(query,arr, function(err, result){
			if(err){
				callback(err);
			} else {
				callback(null, result.rows);
			}
		});
	}

}; // End store


/*
 * Model call from auth/logoutController
 *								 auth/refreshTokenController
 *								 modules/stratagy
 *
*/
exports.deleteByToken = function(client, token, callback){

	let arr = [token];
	var query = `DELETE from sessions WHERE token=$1`	;
	if(client){
		client.query(query,arr, function(err){
			if(err){
				callback(err);
			} else {
				callback(null);
			}
		});
	} else {
		pool.query(query,arr, function(err){
			if(err){
				callback(err);
			} else {
				callback(null);
			}
		});
	}

}; // End deleteByToken


/*
 * Model call from auth/childLoginController
 *
*/
exports.deleteByUser = function(client, user_id){

	let arr = [user_id];
	var query = `DELETE from sessions WHERE user_id=$1`	;
	if(client){
		client.query(query,arr, function(err){
			if(err){
				console.log(err);
			}
		});
	} else {
		pool.query(query,arr, function(err){
			if(err){
				console.log(err);
			}
		});
	}

}; // End deleteByToken

/*
 * Model call from auth/childLoginController
 *
*/
exports.addMessage = function(client, user_id){

	let arr = [user_id];
	var query = `UPDATE sessions SET message = 'Signed out! You have signed in on another device' WHERE user_id=$1`;
	if(client){
		client.query(query,arr, function(err){
			if(err){
				console.log(err);
			}
		});
	} else {
		pool.query(query,arr, function(err){
			if(err){
				console.log(err);
			}
		});
	}

}; // End deleteByToken



/*
 * Model call from modules/stratagy
 *
*/
exports.findByToken = function(client, token, callback){

	let arr = [token];

	var query = `SELECT * FROM sessions WHERE token=$1`	;
	if(client){
		client.query(query,arr, function(err, result){
			if(err){
				callback(err);
			} else {
				callback(null, result.rows);
			}
		});
	} else {
		pool.query(query,arr, function(err, result){
			if(err){
				callback(err);
			} else {
				callback(null, result.rows);
			}
		});
	}

}; // End findByToken


/*
 * Model call from cronjob/removeTempFilesController
 *
*/
exports.removeExpiredSession = function(callback){

	let currTime = Math.round(+new Date()/1000);
	let arr = [currTime];
	var query = `DELETE FROM sessions WHERE exp_time < $1`;
	pool.query(query,arr, function(err){
		if(err){
			callback(err);
		} else {
			callback(null);
		}
	});

}; // End removeExpiredSession

