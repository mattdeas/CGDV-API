'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
	pool = require(path.resolve('lib/db'));


/*
 * Model call from type/typeController
 *
*/
exports.store = function(user_id, callback){

  var query = `INSERT INTO
                  login_histories
                    (
                      user_id,
                      created_at
                    )
                  VALUES ( $1, NOW() )`;

  pool.query(query,[user_id], function(err){
    if(err){
      callback(err);
    } else {
      callback(null);
    }
  });

}; // End addType
