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
              created_at,
              description,
              comments,
              challenge_id
            )
    VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), $13, $14, $15 ) RETURNING id`;

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
        data.seq_no,
        data.description,
        data.comments,
        data.challenge_id
    ];
    
    
    client.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            if(data.challenge_id != null )
            {
                var updatechallenge = "INSERT INTO challenge_visuals (challenge_id, viz_id, active) VALUES ($1, $2, 'true')"
                var challArray = [data.challenge_id,result.rows[0].id];
            
                client.query(updatechallenge, challArray, function(err, result){});
            }
            if(data.selectedIds != null)
            {
                //console.log('IN SELECTEDIDS');
                //console.log(data.selectedIds[0].id);
                //console.log(data.selectedIds.length);
                var i;
                var updateUsers = "INSERT INTO visual_users(vizid, userid) VALUES ($1, $2)";
                //console.log(data.selectedIds[].length);
                for(i = 0; i < data.selectedIds.length; i++ )
                {
                    var usrArray = [result.rows[0].id, data.selectedIds[i].id];
                    client.query(updateUsers, usrArray, function(err, result){});
                }
                
            }

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
    console.log(data);
    var type = data.type ? parseInt(data.type, 10) : 1;
    var offset = 0;
    var page = data.page ? parseInt(data.page, 10) : 1;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;
    if (page) {
        offset = (page - 1) * recordPerPage;
    }
    var search = ' WHERE TRUE';
    console.log('here is vis list',data.viz_id);
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

    if (data.challenge_id) {
        search += ` AND V.id IN (SELECT viz_id FROM challenge_visuals WHERE challenge_id = ${data.challenge_id}  )`;
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
                        CASE WHEN U IS NOT NULL THEN 1 ELSE 0 END AS upvoted,
                        v.description,
                        v.comments,
                        V.challenge_id,
                        (SELECT COUNT(id) FROM visualcomment WHERE vizid = v.id) AS vnumcomments,
                        (SELECT COUNT(b.id) FROM badge b INNER JOIN user_badges ub ON ub.id = b.id WHERE ub.user_id = V.user_id and ub.id = 1) as topcontrib,
                        (SELECT COUNT(cw.challenge_id) FROM challenge_winners cw WHERE cw.first_user_id = V.user_id ) as winner,
                        (SELECT COUNT(cw.challenge_id) FROM challenge_winners cw WHERE cw.second_user_id = V.user_id or cw.third_user_id = V.user_id) as runnerup
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
                        USR.avatar AS user_avatar,
                        V.description,
                        V.comments,
                        V.challenge_id,
                        (SELECT COUNT(id) FROM visualcomment WHERE vizid = v.id) AS vnumcomments,
                        (SELECT COUNT(b.id) FROM badge b INNER JOIN user_badges ub ON ub.id = b.id WHERE ub.user_id = V.user_id and ub.id = 1) as topcontrib,
                        (SELECT COUNT(cw.challenge_id) FROM challenge_winners cw WHERE cw.first_user_id = V.user_id ) as winner,
                        (SELECT COUNT(cw.challenge_id) FROM challenge_winners cw WHERE cw.second_user_id = V.user_id or cw.third_user_id = V.user_id) as runnerup
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

exports.getVisualUsersById = function(viz_id, callback) {
    
    console.log(viz_id);
    console.log(viz_id.viz_id)
    var query = `select v.user_id,u.firstname,u.lastname,u.avatar
    from visual v
    INNER JOIN users u ON u.id = v.user_id
    where v.id = $1
    UNION ALL 
    select DISTINCT vu.userid as user_id,u.firstname,u.lastname,u.avatar
    FROM visual_users vu 
    INNER JOIN users u ON u.id = vu.userid
    WHERE vizid = $1`;
    
    pool.query(query, [viz_id.viz_id], function(err, result) {
        if (err) {
            console.log('it didnt worked');
            callback(err);
        } else {
            console.log('it worked');
            console.log(result.rows);
            console.log(result.rows.count);
            callback(null, result.rows);
        }
    });
}


exports.getVisualById = function(viz_id, callback) {
    var query = 'SELECT *, (SELECT COUNT(id) FROM visualcomment WHERE vizid = v.id) AS vnumcomments FROM visual v WHERE id=$1';
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
          updated_at=Default,
          description=$13,
          comments=$14,
          challenge_id = $15
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
        data.user_id,
        data.description,
        data.comments,
        data.challenge_id
    ];
    if (client) {
        client.query(query, dataArray, function(err, result) {
            if (err) {
                callback(err);
            } else {

                var updatechallenge = "";
                updatechallenge = "UPDATE challenge_visuals SET active = 'false' WHERE viz_id = $1 ";
                var challArray = [data.id];
                client.query(updatechallenge, challArray, function(err, result){});
                if(data.challenge_id != null )
                {
                    updatechallenge = "INSERT INTO challenge_visuals (challenge_id, viz_id, active) VALUES ($1, $2, 'true')"
                    var challArray2 = [data.challenge_id,data.id];
                    client.query(updatechallenge, challArray2, function(err, result){});
                }
                
                if(data.selectedIds != null && data.selectedIds.length > 0)
                {
                    var i;
                    var clearUsers = "DELETE FROM visual_users WHERE vizid = $1";
                    var vizArray = [data.id];
                    client.query(clearUsers, vizArray, function(err, result){});
                    var updateUsers = "INSERT INTO visual_users(vizid, userid) VALUES ($1, $2)";
                    //console.log(data.selectedIds[].length);
                    for(i = 0; i < data.selectedIds.length; i++ )
                    {
                        var usrArray = [data.id, data.selectedIds[i].id];
                        client.query(updateUsers, usrArray, function(err, result){});
                    }
                    
                }
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
    console.log("getUpvoteById");
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
    console.log("createUpvote");
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
    console.log("updateVisualVote");
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