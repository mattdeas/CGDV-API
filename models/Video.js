'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
    pool = require(path.resolve('lib/db'));

exports.addVideo = ( data, callback) => {
    var query = `
        INSERT INTO
          video
            (
              id,
              title,
              author,
              university_id,              
              country_id,
              tags,
              embed_code,
              seq_no,
              created_at
            )
    VALUES ( Default, $1, $2, $3, $4, $5, $6, $7, NOW() ) RETURNING id`;


    var dataArray = [        
        data.title,
        data.author,
        data.university_id,
        data.country_id,
        data.tags,
        data.embed_code,
        data.seq_no
    ];

    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.videSearchCount = function(data, callback) {
    var search = ' WHERE TRUE';    
    if (data.id) {
        search += `  AND id=${data.id} `;
    }
    if (data.title) {
        data.title = data.title.replace(/(\')+/g,"''");
        search += `  AND title ILIKE '%${data.title}%' `;
    }
    if (data.author) {
        data.author = data.author.replace(/(\')+/g,"''");
        search += `  AND author ILIKE '%${data.author}%' `;
    }
    if (data.tags) {
        data.tags = data.tags.replace(/(\')+/g,"''");
        search += `  AND tags ILIKE '%${data.tags}%' `;
    }
    var query = `SELECT
                  count(*) AS total
              FROM video` + search;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getVideoList = function(data, callback) {
    var offset = 0;
    var page = data.page ? parseInt(data.page, 10) : 1;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;
    if (page) {
        offset = (page - 1) * recordPerPage;
    }
    var search = ' WHERE TRUE';
    
    if (data.id) {
        search += `  AND id=${data.id} `;
    }
    if (data.title) {
        data.title = data.title.replace(/(\')+/g,"''");
        search += `  AND title ILIKE '%${data.title}%' `;
    }
    if (data.author) {
        data.author = data.author.replace(/(\')+/g,"''");
        search += `  AND author ILIKE '%${data.author}%' `;
    }
    if (data.tags) {
        data.tags = data.tags.replace(/(\')+/g,"''");
        search += `  AND tags ILIKE '%${data.tags}%' `;
    }

    var orderby = '';
    if (data.orderby) {
        var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        orderby = ` ORDER BY ${data.orderby} ${orderbydirection}`

    }else{
        orderby = ` ORDER BY created_at ASC`    
    }
    var query = `SELECT * 
                    FROM video` +
        search +
        orderby +
        ` LIMIT ${recordPerPage}
                    OFFSET ${offset}`;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.chekcVideoExists = function(id, callback) {
    var query = 'SELECT * FROM video WHERE id=$1 ';
    pool.query(query, [id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.updateVideo = (client, data, callback) => {
    var query = `
        UPDATE
          video
        SET                  
          title=$1,
          author=$2,
          university_id=$3,
          country_id=$4,
          tags=$5,
          embed_code=$6,
          seq_no=$7,
          updated_at=Default
        WHERE
          id=$8`;

    var dataArray = [
        data.title,
        data.author,
        data.university_id,
        data.country_id,
        data.tags,
        data.embed_code,
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

exports.deleteVideo = function(id, callback) {
    var query = `DELETE
            FROM
              video
            WHERE
              id=$1`;

    pool.query(query, [id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};