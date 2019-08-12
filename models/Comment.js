'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
    pool = require(path.resolve('lib/db'));

exports.addVisualComment = (client, data, callback) => {
    console.log('visualcomment add');
    var query = `
    INSERT INTO visualcomment(
        vizid, commenttext, user_id, created_at, updated_at, replycommentid)
    VALUES ( $1, $2, $3, NOW(), NOW(), $4 ) RETURNING id`;


    var dataArray = [
        data.vizid,
        data.commentText,
        data.user_id,
        data.replytocommentid
    ];

    client.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getVisualComments = function(data, callback) {
    var type = data.type ? parseInt(data.type, 10) : 1;
    var offset = 0;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;

    var search = ' WHERE TRUE';

    if (data.viz_id) {
        search += `  AND VC.vizid=${data.viz_id} `;
    }


    var orderby = '';
    if (data.orderby) {
        var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        orderby = ` ORDER BY VC.${data.orderby} ${orderbydirection}`

    }else{
        orderby = ` ORDER BY VC.created_at DESC`    
    }
    var query = '';
        
    query = `SELECT VC.id,
                    VC.vizid,
                    VC.commenttext,
                    VC.user_id,
                    TO_CHAR(VC.created_at, 'DD-Mon-YYYY hh:mm:ss') as created_at,
                    VC.updated_at,
                    VC.replycommentid,
                    U.firstname,
                    U.lastname,
                    U.avatar,
                    V.user_id as vizcreator_id
            FROM visualcomment VC 
            INNER JOIN users U ON VC.user_id = U.id
            INNER JOIN visual V ON VC.vizid = V.id
            ` +
            search +
            orderby;
                    
    console.log('query',query)
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.getVisualCommentsById = function(data, callback) {
    
    var query = 'SELECT * FROM visualcomment WHERE vizid=$1 ORDER BY Created_At ASC';
    pool.query(query, [viz_id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}





exports.updateVisualComment = (client, data, callback) => {

    //var query = `
    //INSERT INTO public.visualcomment(
    //    vizid, commenttext, userid, created_at, updated_at, replycommentid)
    //VALUES ( $1, $2, $3, NOW(), NOW(), $4 ) RETURNING id`;

    var query = `
        UPDATE
          visualcomment
        SET                  
            commenttext=$1,
            updated_at=Default
        WHERE
          id=$3 AND user_id=$2`;

    var dataArray = [
    data.commentText,
    data.user_id,
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

exports.deleteVisualComment = function(id, callback) {
    var query = `DELETE
            FROM
              visualcomment
            WHERE
              id=$1`;

    pool.query(query, [id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}


