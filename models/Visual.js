'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
    pool = require(path.resolve('lib/db'));

exports.addVisual = (client, data, callback) => {
    var query = `
        INSERT INTO
          visual
            (
              title,
              author,
              category_id,              
              country_id,
              tags,
              avatar,
              embed_code,
              user_id,
              created_by_admin,
              university_id,
              data_src,
              seq_no,
              created_at
            )
    VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW() ) RETURNING id`;


    var dataArray = [
        data.title,
        data.author,
        data.category_id,
        data.country_id,
        data.tags,
        data.avatar,
        data.embed_code,
        data.user_id,
        data.created_by_admin || 0,
        data.university_id,
        data.data_src,
        data.seq_no
    ];

    client.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.visualSearchCount = function(data, callback) {
    var search = ' WHERE TRUE';

    if (data.viz_id) {
        search += `  AND id=${data.viz_id} `;
    }
    if (data.user_id) {
        search += `  AND user_id=${data.user_id} `;
    }
    if (data.is_featured == 0 || data.is_featured == 1) {
        search += `  AND is_featured=${data.is_featured} `;
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
              FROM visual` + search;
              console.log('query',query)
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getVisualList = function(data, callback) {
    var type = data.type ? parseInt(data.type, 10) : 1;
    var offset = 0;
    var page = data.page ? parseInt(data.page, 10) : 1;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;
    if (page) {
        offset = (page - 1) * recordPerPage;
    }
    var search = ' WHERE TRUE';

    if (data.viz_id) {
        search += `  AND V.id=${data.viz_id} `;
    }

    if (data.user_id) {
        search += `  AND V.user_id=${data.user_id} `;
    }
    if (data.country_id) {
        search += `  AND V.country_id=${data.country_id} `;
    }
    if (data.category_id) {
        search += `  AND V.category_id=${data.category_id} `;
    }
    if (data.university_id) {
        search += `  AND V.university_id=${data.university_id} `;
    }
    if (data.is_featured == 0 || data.is_featured == 1) {
        search += `  AND V.is_featured=${data.is_featured} `;
    }

    if (data.title) {
        data.title = data.title.replace(/(\')+/g,"''");
        search += `  AND V.title ILIKE '%${data.title}%' `;
    }
    if (data.author) {
        data.author = data.author.replace(/(\')+/g,"''");
        search += `  AND V.author ILIKE '%${data.author}%' `;
    }
    if (data.tags) {
        data.tags = data.tags.replace(/(\')+/g,"''");
        search += `  AND V.tags ILIKE '%${data.tags}%' `;
    }

    var orderby = '';
    if (data.orderby) {
        var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        orderby = ` ORDER BY V.${data.orderby} ${orderbydirection}`

    }else{
        orderby = ` ORDER BY V.created_at DESC`    
    }
    var query = '';
    if(data.loggedInUserId){
        
        query = `SELECT V.id,
                        V.title,
                        V.author,
                        V.category_id,
                        V.country_id,
                        V.university_id,
                        V.tags,
                        V.upvote,
                        V.avatar,
                        V.embed_code,
                        V.data_src,
                        V.seq_no,
                        V.user_id,
                        CONCAT(USR.firstname, ' ', USR.lastname) AS username,
                        USR.avatar AS user_avatar,
                        CASE WHEN U IS NOT NULL THEN 1 ELSE 0 END AS upvoted
                        FROM visual V 
                        LEFT JOIN (
                            SELECT * 
                                FROM upvote
                                WHERE user_id=${data.loggedInUserId}
                        ) U ON (U.viz_id = V.id)
                        LEFT JOIN users USR ON (USR.id = V.user_id)` +
            search +
            orderby +
            ` LIMIT ${recordPerPage}
                        OFFSET ${offset}`;
    }else{        
        query = `SELECT V.id,
                        V.title,
                        V.author,
                        V.category_id,
                        V.country_id,
                        V.university_id,
                        V.tags,
                        V.upvote,
                        V.avatar,
                        V.embed_code,
                        V.data_src,
                        V.seq_no,
                        V.user_id,
                        CONCAT(USR.firstname, ' ', USR.lastname) AS username,
                        USR.avatar AS user_avatar
                        FROM visual V
                        LEFT JOIN users USR ON (USR.id = V.user_id)` +
            search +
            orderby +
            ` LIMIT ${recordPerPage}
                        OFFSET ${offset}`;
    }
    console.log('query',query)
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getVisualById = function(viz_id, callback) {
    var query = 'SELECT * FROM visual WHERE id=$1';
    pool.query(query, [viz_id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}
exports.chekcVisualExists = function(viz_id, user_id, callback) {
    var query = 'SELECT * FROM visual WHERE id=$1 AND user_id=$2';
    pool.query(query, [viz_id, user_id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.setFeatured = (client, data, callback) => {
    var query = `
        UPDATE
          visual
        SET 
          is_featured=$1,
          updated_at=Default
        WHERE
          id=$2`;

    var dataArray = [
        Number(data.is_featured),
        data.viz_id
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

exports.updateVisual = (client, data, callback) => {
    var query = `
        UPDATE
          visual
        SET                  
          title=$1,
          author=$2,
          category_id=$3,
          country_id=$4,
          university_id=$5,
          tags=$6,
          avatar=$7,
          embed_code=$8,
          data_src=$9,
          seq_no=$10,
          updated_at=Default
        WHERE
          id=$11 AND user_id=$12`;

    var dataArray = [
        data.title,
        data.author,
        data.category_id,
        data.country_id,
        data.university_id,
        data.tags,
        data.avatar,
        data.embed_code,
        data.data_src,
        data.seq_no,
        data.id,
        data.user_id
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

exports.deleteVisual = function(id, user_id, callback) {
    var query = `DELETE
            FROM
              visual
            WHERE
              id=$1 AND user_id=$2`;

    pool.query(query, [id, user_id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};

exports.vizOfDaySearchCount = function(data, callback) {
    var search = '';

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
    var query = `SELECT count(*) AS total
                    FROM visual 
                    WHERE id 
                    IN (SELECT viz_id FROM vizofday 
                            WHERE category_id=${data.category_id})` + search;
    
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getVizOfDayList = function(data, callback) {
    var offset = 0;
    var page = data.page ? parseInt(data.page, 10) : 1;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;
    if (page) {
        offset = (page - 1) * recordPerPage;
    }
    var search = '';

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

    }
    var query = `SELECT * 
                    FROM visual 
                    WHERE id 
                    IN (SELECT viz_id FROM vizofday 
                            WHERE category_id=${data.category_id})` +
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


exports.notInVizOfDaySearchCount = function(data, callback) {
    var query = `SELECT COUNT(*) 
                    FROM vizofday
                    WHERE category_id=${data.category_id}`;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            var query2;
            var search = '';

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

            if (result.rows[0].count > 0) {
                query2 = `SELECT count(*) AS total
                            FROM visual 
                            WHERE id 
                            NOT IN (SELECT viz_id FROM vizofday 
                                    WHERE category_id=${data.category_id})` + search;
            } else {
                query2 = `SELECT count(*) AS total FROM visual WHERE TRUE` + search;

            }
            pool.query(query2, function(err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result.rows);
                }
            });
        }
    });
}

exports.getNotInVizOfDayList = function(data, callback) {
    var query = `SELECT COUNT(*) 
                    FROM vizofday
                    WHERE category_id=${data.category_id}`;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            var query2;
            var offset = 0;
            var page = data.page ? parseInt(data.page, 10) : 1;
            var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;
            if (page) {
                offset = (page - 1) * recordPerPage;
            }
            var search = '';

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

            }
            var query2;
            if (result.rows[0].count > 0) {
                query2 = `SELECT * 
                            FROM visual 
                            WHERE id 
                            NOT IN (SELECT viz_id FROM vizofday 
                                    WHERE category_id=${data.category_id})` +
                    search +
                    orderby +
                    ` LIMIT ${recordPerPage}
                            OFFSET ${offset}`;
            } else {
                query2 = `SELECT * FROM visual  WHERE TRUE` + search +
                    orderby +
                    ` LIMIT ${recordPerPage}
                            OFFSET ${offset}`;
            }

            pool.query(query2, function(err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result.rows);
                }
            });
        }
    });
}


exports.getVizOfDayById = function(category_id, viz_id, callback) {
    var query = `SELECT * 
                    FROM vizofday
                    WHERE category_id=$1 AND viz_id=$2`;
    pool.query(query, [category_id, viz_id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.updateVizOfDay = (category_id, viz_id, addFlag, callback) => {
    var query, dataArray;
    if (addFlag) {
        query = `
        INSERT INTO
          vizofday
            (
              category_id,
              viz_id
            )
        VALUES ( $1, $2 ) RETURNING id`;
    } else {
        query = `DELETE
            FROM
              vizofday
            WHERE
              category_id=$1 AND viz_id=$2`;
    }


    dataArray = [
        category_id, viz_id
    ];

    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}


exports.getUpvoteById = function(user_id, viz_id, callback) {
    var query = `SELECT * 
                    FROM upvote
                    WHERE user_id=$1 AND viz_id=$2`;
    pool.query(query, [user_id, viz_id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.createUpvote = (user_id, viz_id, callback) => {    
    var query = `
        INSERT INTO
          upvote
            (
              user_id,
              viz_id
            )
        VALUES ( $1, $2 ) RETURNING id`;

     var dataArray = [
        user_id, viz_id
    ];

    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

exports.updateVisualVote = (viz_id, callback) => {    
    var query = `
        UPDATE visual 
        SET upvote=upvote+1,updated_at=Default
        WHERE id=${viz_id} RETURNING *`;

    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}