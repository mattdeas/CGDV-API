'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
	pool = require(path.resolve('lib/db'));






exports.statisticsSearchCount = function(data, callback) {
    var search = '';
    if(data.name) {
        data.name = data.name.replace(/(\')+/g,"''");
        search += `  AND name ILIKE '%${data.name}%'`;
    }

    if(data.country_id) {
        search += `  AND country_id='${data.country_id}'`;
    }
    
    var query = `SELECT
                  count(*) AS total
              FROM universities
              WHERE TRUE `+search;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getStatistics = function(data, callback) {
    
    var query = `SELECT 
    (SELECT COUNT(id) FROM Users) as Users,
    (SELECT COUNT(id) FROM Visual) as Visuals,
    (SELECT COUNT(uv.id) FROM universities uv WHERE uv.id in (SELECT university_id FROM users)) as universities,
    (SELECT COUNT(c.id) FROM countries c WHERE c.id in (SELECT country_id FROM users)) as countries`; 
    
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.checkUniversityExistsByName= function(name,  callback) {

    var query = 'SELECT * FROM universities WHERE name=$1 ';
    pool.query(query, [name], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.checkUniversityExistsById = function(id, callback) {

    var query = 'SELECT * FROM universities WHERE id=$1';
    pool.query(query, [id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}