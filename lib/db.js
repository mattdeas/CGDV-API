'use strict';

/**
 * Module dependencies.
 */
const config = require('../config/config');
const chalk = require('chalk');

const pg = require('pg');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var dbConfig = {
  user: config.postgres.user, //env var: PGUSER
  database: config.postgres.database, //env var: PGDATABASE
  password: config.postgres.password, //env var: PGPASSWORD
  host: config.postgres.host, // Server hosting the postgres database
  port: config.postgres.port, //env var: PGPORT
  max: config.postgres.max, // max number of clients in the pool
  ssl: true,
  idleTimeoutMillis: config.postgres.idleTimeoutMillis, // how long a client is allowed to remain idle before being closed
};
//this initializes a connection pool
//it will keep idle connections open for 30 seconds
//and set a limit of maximum 10 idle clients
const pool = new pg.Pool(dbConfig);

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
console.log(chalk.red('idle client error', err.message, err.stack));
});

//export the query method for passing queries to the pool
module.exports.query = function (text, values, callback) {
  //console.log('query:', text, values);
  return pool.query(text, values, callback);
};

module.exports.rollback = function(client, done) {
  client.query('ROLLBACK', function(err) {
    //if there was a problem rolling back the query
    //something is seriously messed up.  Return the error
    //to the done function to close & remove this client from
    //the pool.  If you leave a client in the pool with an unaborted
    //transaction weird, hard to diagnose problems might happen.
    return done(err);
  });
};

pool.on('connect', function(connection) {
    //console.log('Connected to pg db:');
});

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = function (callback) {
  return pool.connect(callback);
};







