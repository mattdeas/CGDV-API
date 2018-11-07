'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
	pool = require(path.resolve('lib/db'));




/*
 * get country list
 *
*/
exports.getCountryList = function(callback){

  var query = 'SELECT * FROM countries';
  pool.query(query, function(err, result){
    if(err){
      callback(err);
    } else {
      callback(null, result.rows);
    }
  });
}

exports.countrySearchCount = function(data, callback) {
    var search = '';
    if(data.name) {
        data.name = data.name.replace(/(\')+/g,"''");
        search += `  AND name ILIKE '%${data.name}%'`;
    }
    
    var query = `SELECT
                  count(*) AS total
              FROM countries
              WHERE TRUE `+search;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getCountry = function(data, callback) {
    var offset = 0;
    var page = data.page ? parseInt(data.page, 10) : 1;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 0;
    if(page){
        offset = (page-1)*recordPerPage;
    }
    var limit = '';
    if(recordPerPage){
    	limit += ` LIMIT ${recordPerPage} `;
    }
    var search = '';
    if(data.id) {
        search += `  AND id=${data.id}`;         
    }
    if(data.name) {
        data.name = data.name.replace(/(\')+/g,"''");
        search += `  AND name ILIKE '%${data.name}%'`;         
    }
    var orderby = '';
    if(data.orderby){
        var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        orderby = ` ORDER BY ${data.orderby} ${orderbydirection}`
    
    }else{
        orderby = ` ORDER BY name ASC`    
    }
    var query = `SELECT * 
                    FROM countries 
                    WHERE TRUE `+search+orderby+
                    limit+
                    ` OFFSET ${offset}` ;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.checkCountryExistsByName = function(name, callback) {

    var query = 'SELECT * FROM countries WHERE name=$1';
    pool.query(query, [name], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.checkCountryExistsById = function(name, callback) {

    var query = 'SELECT * FROM countries WHERE id=$1';
    pool.query(query, [name], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.addCountry = function(data, callback) {

   var query = `
        INSERT INTO
          countries
            (                
              name
            )
    VALUES ( $1  ) RETURNING id`;


    var dataArray = [
        data.name
    ];

    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.updateCountry = (client, data, callback) => {
    var query = `
        UPDATE
          countries
        SET                  
          name=$1,
          updated_at=Default
        WHERE
          id=$2`;

    var dataArray = [
        data.name,
        data.id
    ];
    if (client) {
        client.query(query, dataArray, function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    } else {
        pool.query(query, dataArray, function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    }


}

exports.deleteCountry = function(id,  callback) {
    var query = `DELETE
            FROM
              countries
            WHERE
              id=$1 `;

    pool.query(query, [id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};
