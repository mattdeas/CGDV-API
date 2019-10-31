'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
    pool = require(path.resolve('lib/db'));


    exports.updateChallenge = (client, data, callback) => {
        var query = `
        with updated as (
        UPDATE challenge
        SET challenge_name = $2, startdate = $3, enddate = $4, challenge_description = $5
        WHERE id = $1
        returning *
        )
        INSERT INTO challenge_winners(
            first_user_id, first_viz_id, second_user_id, second_viz_id, third_user_id, 
            third_viz_id, challenge_id)
        VALUES ($6, $7, $8, $9, $10, $11, $1) 
        ON CONFLICT (challenge_id)
        DO UPDATE SET first_user_id = $6, first_viz_id = $7, 
        second_user_id = $8, second_viz_id =$9 , third_user_id =$10, third_viz_id =$11;`;
              
        console.log('UpdateChallenge');
        var dataArray = [
            data.id,
            data.challenge_name,
            data.start,
            data.end,
            data.challenge_description,
            data.first_user_id,
            data.first_viz_id,
            data.second_user_id,
            data.second_viz_id,
            data.third_user_id,
            data.third_viz_id
        ];
        console.log('data id', data.id);
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

    exports.addChallenge = ( data, callback) => {
        var query = `
            INSERT INTO public.challenge(
                challenge_name, startdate, enddate, challenge_description
                )
            VALUES ($1, $2, $3, $4);

            `;
    
    
        var dataArray = [        
            data.challenge_name,
            data.start,
            data.end,
            data.challenge_description
        ];
    
        pool.query(query, dataArray, function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result.rows);
            }
        });
    }


exports.challengeSearchCount = function(data, callback) {
    // var search = ' WHERE TRUE';

    // if (data.viz_id) {
    //     search += `  AND id=${data.viz_id} `;
    // }
    // if (data.user_id) {
    //     search += `  AND user_id=${data.user_id} `;
    // }
    // if (data.is_featured == 0 || data.is_featured == 1) {
    //     search += `  AND is_featured=${data.is_featured} `;
    // }

    // if (data.title) {
    //     data.title = data.title.replace(/(\')+/g,"''");
    //     search += `  AND title ILIKE '%${data.title}%' `;
    // }
    // if (data.author) {
    //     data.author = data.author.replace(/(\')+/g,"''");
    //     search += `  AND author ILIKE '%${data.author}%' `;
    // }
    // if (data.tags) {
    //     data.tags = data.tags.replace(/(\')+/g,"''");
    //     search += `  AND tags ILIKE '%${data.tags}%' `;
    // }
    var query = `SELECT
                  count(*) AS total
              FROM challenges` + search;
              console.log('query',query)
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getChallengeListDropDown = function(callback){

    var query = 'SELECT * FROM challenge C WHERE enddate >= now() and startdate <= now()';
    pool.query(query, function(err, result){
      if(err){
        callback(err);
      } else {
        callback(null, result.rows);
      }
    });
  }

  exports.getChallengeListDropDownALL = function(callback){

    var query = 'SELECT * FROM challenge ORDER BY enddate DESC';
    pool.query(query, function(err, result){
      if(err){
        callback(err);
      } else {
        callback(null, result.rows);
      }
    });
  }

exports.getChallengeListDropDown = function(data, callback) {
    console.log(data);
    var type = data.type ? parseInt(data.type, 10) : 1;
    var offset = 0;
    var page = data.page ? parseInt(data.page, 10) : 1;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;
    if (page) {
        offset = (page - 1) * recordPerPage;
    }
    var search = ' ';


    var orderby = '';
    //if (data.orderby) {
        //var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        //orderby = ` ORDER BY V.${data.orderby} ${orderbydirection}`

    //}else{
        orderby = ` `    
    //}
    var query = '';
    
    query = `SELECT id, challenge_name FROM challenge C WHERE enddate >= now() and startdate <= now() ` +
        search +
        orderby +
        ` LIMIT ${recordPerPage}
                    OFFSET ${offset}`;
    console.log('query',query)
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getChallengeListDropDownALL = function(data, callback) {
    console.log(data);
    var type = data.type ? parseInt(data.type, 10) : 1;
    var offset = 0;
    var page = data.page ? parseInt(data.page, 10) : 1;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;
    if (page) {
        offset = (page - 1) * recordPerPage;
    }
    var search = ' ';


    var orderby = '';
    //if (data.orderby) {
        //var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        //orderby = ` ORDER BY V.${data.orderby} ${orderbydirection}`

    //}else{
        orderby = ` `    
    //}
    var query = '';
    
    query = `SELECT id, challenge_name FROM challenge C ORDER BY C.enddate DESC` +
        search +
        orderby +
        ` LIMIT ${recordPerPage}
                    OFFSET ${offset}`;
    console.log('query',query)
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.getChallengeList = function(data, callback) {
    console.log(data);
    var type = data.type ? parseInt(data.type, 10) : 1;
    var offset = 0;
    var page = data.page ? parseInt(data.page, 10) : 1;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;
    if (page) {
        offset = (page - 1) * recordPerPage;
    }
    var search = ' WHERE TRUE';

    //console.log('data.id',data.challengeid);
    console.log('here is vis list',data.id);
    if (data.id) {
        search += `  AND C.id=${data.id} `;
    }

    //if (data.user_id) {
        //search += `  AND V.user_id=${data.user_id} `;
    //}
    //if (data.country_id) {
        //search += `  AND V.country_id=${data.country_id} `;
    //}
    //if (data.category_id) {
        //search += `  AND V.category_id=${data.category_id} `;
    //}
    //if (data.university_id) {
        //search += `  AND V.university_id=${data.university_id} `;
    //}
    //if (data.is_featured == 0 || data.is_featured == 1) {
        //search += `  AND V.is_featured=${data.is_featured} `;
    //}

    //if (data.title) {
    //    data.title = data.title.replace(/(\')+/g,"''");
    //    search += `  AND V.title ILIKE '%${data.title}%' `;
    //}
    //if (data.author) {
    //    data.author = data.author.replace(/(\')+/g,"''");
    //    search += `  AND V.author ILIKE '%${data.author}%' `;
    //}
    //if (data.tags) {
    //    data.tags = data.tags.replace(/(\')+/g,"''");
    //    search += `  AND V.tags ILIKE '%${data.tags}%' `;
    //}

    var orderby = '';
    //if (data.orderby) {
        //var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        //orderby = ` ORDER BY V.${data.orderby} ${orderbydirection}`

    //}else{
        orderby = ` ORDER BY C.enddate DESC`    
    //}
    var query = '';
    
    query = `SELECT C.id,
    C.challenge_name,
    TO_CHAR(C.startdate :: DATE, 'dd-Mon-yyyy') AS start,
    TO_CHAR(C.enddate :: DATE, 'dd-Mon-yyyy') AS end,
    C.challenge_description,
    C.imgpath,
    case when C.enddate <= now() then False ELSE True END AS OpenClose,
    CW.first_user_id, CW.second_user_id, CW.third_user_id,
    CW.first_viz_id, CW.second_viz_id, CW.third_viz_id,
    (SELECT CONCAT(u.firstname, ' ', u.lastname) FROM users u WHERE CW.first_user_id = u.id ) AS FirstUserName,
    (SELECT CONCAT(u.firstname, ' ', u.lastname) FROM users u WHERE CW.second_user_id = u.id ) AS SecondUserName,
    (SELECT CONCAT(u.firstname, ' ', u.lastname) FROM users u WHERE CW.third_user_id = u.id ) AS ThirdUserName,
    (SELECT u.avatar FROM users u WHERE CW.first_user_id = u.id ) AS FirstAvatar,
    (SELECT u.avatar FROM users u WHERE CW.second_user_id = u.id ) AS SecondAvatar,
    (SELECT u.avatar FROM users u WHERE CW.third_user_id = u.id ) AS ThirdAvatar,
    (SELECT v.title FROM visual v WHERE v.id = CW.first_viz_id) AS FirstTitle,
    (SELECT v.title FROM visual v WHERE v.id = CW.second_viz_id) AS SecondTitle,
    (SELECT v.title FROM visual v WHERE v.id = CW.third_viz_id) AS ThirdTitle,
    (SELECT v.avatar FROM visual v WHERE v.id = CW.first_viz_id) AS FirstVizAvatar,
    (SELECT v.avatar FROM visual v WHERE v.id = CW.second_viz_id) AS SecondVizAvatar,
    (SELECT v.avatar FROM visual v WHERE v.id = CW.third_viz_id) AS ThirdVizAvatar,
    C.notificationshow, C.embedded_path, C.embedded_img_local
    FROM challenge C
    LEFT JOIN challenge_winners CW ON CW.challenge_id = C.id ` +
        search +
        orderby +
        ` LIMIT ${recordPerPage}
                    OFFSET ${offset}`;
    console.log('query',query)
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.challengeSearchCount = function(data, callback) {
    var search = ' WHERE TRUE';

    // if (data.viz_id) {
    //     search += `  AND id=${data.viz_id} `;
    // }
    // if (data.user_id) {
    //     search += `  AND user_id=${data.user_id} `;
    // }
    // if (data.is_featured == 0 || data.is_featured == 1) {
    //     search += `  AND is_featured=${data.is_featured} `;
    // }

    // if (data.title) {
    //     data.title = data.title.replace(/(\')+/g,"''");
    //     search += `  AND title ILIKE '%${data.title}%' `;
    // }
    // if (data.author) {
    //     data.author = data.author.replace(/(\')+/g,"''");
    //     search += `  AND author ILIKE '%${data.author}%' `;
    // }
    // if (data.tags) {
    //     data.tags = data.tags.replace(/(\')+/g,"''");
    //     search += `  AND tags ILIKE '%${data.tags}%' `;
    // }
    var query = `SELECT
                  count(*) AS total
              FROM challenge ` + search;
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
    var query = 'SELECT *, (SELECT COUNT(id) FROM visualcomment WHERE vizid = v.id) AS vnumcomments FROM visual WHERE id=$1';
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



exports.deleteChallenge = function(id, user_id, callback) {
    var query = `DELETE
            FROM
              challenge
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
