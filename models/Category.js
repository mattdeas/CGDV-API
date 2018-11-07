'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
	pool = require(path.resolve('lib/db'));



/*
 * get category list
 *
*/
exports.getCategoryList = function(type, callback){
  type = type || 'visual';
  var query = 'SELECT * FROM category WHERE type=$1';
  pool.query(query,[type], function(err, result){
    if(err){
      callback(err);
    } else {
      callback(null, result.rows);
    }
  });
}

exports.categorySearchCount = function(data, callback) {
    var search = '';
    if(data.name) {
        data.name = data.name.replace(/(\')+/g,"''");
        search += `  AND name ILIKE '%${data.name}%'`;
    }

    if(data.type) {
        search += `  AND type='${data.type}'`;
    }
    
    var query = `SELECT
                  count(*) AS total
              FROM category
              WHERE TRUE `+search;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getCategory = function(data, callback) {
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
    if(data.type) {
        search += `  AND type='${data.type}'`;         
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
                    FROM category 
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

exports.checkCategoryExistsByNameNType = function(name, type, callback) {

    var query = 'SELECT * FROM category WHERE name=$1 AND type=$2';
    pool.query(query, [name, type], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.checkCategoryExistsById = function(id, callback) {

    var query = 'SELECT * FROM category WHERE id=$1';
    pool.query(query, [id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.addCategory = function(data, callback) {

   var query = `
        INSERT INTO
          category
            (
              name,
              type,
              seq_no
            )
    VALUES ( $1, $2, $3 ) RETURNING id`;


    var dataArray = [
        data.name,
        data.type
    ];
    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.updateCategory = (client, data, callback) => {
    var query = `
        UPDATE
          category
        SET                  
          name=$1,
          type=$2,
          seq_no=$3,
          updated_at=Default
        WHERE
          id=$4`;

    var dataArray = [
        data.name,
        data.type,
        data.seq_no,
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

exports.deleteCategory = function(id,  callback) {
    var query = `DELETE
            FROM
              category
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
