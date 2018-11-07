'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
	pool = require(path.resolve('lib/db'));



/*
 * get university list
 *
*/
exports.getUniversityList = function(type, callback){
  type = type || 'visual';
  var query = 'SELECT * FROM universities WHERE type=$1';
  pool.query(query,[type], function(err, result){
    if(err){
      callback(err);
    } else {
      callback(null, result.rows);
    }
  });
}

exports.universitySearchCount = function(data, callback) {
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

exports.getUniversity = function(data, callback) {
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
    if(data.country_id) {
        search += `  AND country_id='${data.country_id}'`;         
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
                    FROM universities 
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





exports.addUniversity = function(data, callback) {

   var query = `
        INSERT INTO
          universities
            (
              name,
              country_id,
              avatar
            )
    VALUES ( $1, $2, $3 ) RETURNING id`;


    var dataArray = [
        data.name,
        data.country_id,
        data.avatar || null
    ];
    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.updateUniversity = (client, data, callback) => {
    var query = `
        UPDATE
          universities
        SET                  
          name=$1,
          country_id=$2,
          avatar=$3,
          updated_at=Default
        WHERE
          id=$4`;

    var dataArray = [
        data.name,
        data.country_id,
        data.avatar || null,
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

exports.deleteUniversity = function(id,  callback) {
    var query = `DELETE
            FROM
              universities
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
