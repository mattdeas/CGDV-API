'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
    pool = require(path.resolve('lib/db'));


/*
 * Model call from user/admin.register.Controller
                   user/user.register.Controller
 *
 */
exports.userRegister = (client, data, callback) => {
    var query = `
        INSERT INTO
          users
            (
              email,
              password,
              firstname,
              lastname,
              type,
              status,
              avatar, 
              gender,
              mobile,
              bio,
              university_id,
              category_id,
              country_id,
              created_by_admin,
              google_id,
              facebook_id,
              is_manual,
              created_at,
              role,
              seq_no
            )
    VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), $18, $19 ) RETURNING id,firstname,lastname,avatar,type`;


    var dataArray = [
        data.email,
        data.password,
        data.firstname,
        data.lastname,
        data.type,
        data.status,
        data.avatar || 'storage/default.jpeg',
        data.gender,
        data.mobile,
        data.bio,
        data.university_id,
        data.category_id,
        data.country_id,
        data.created_by_admin || 0,
        data.google_id || null,
        data.facebook_id || null,
        data.is_manual || 0,
        data.role,
        data.seq_no || 1
    ];

    client.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

/*
 * Model call from auth/loginController
 *
 */
exports.getUserByEmail = function(email, roll, callback) {

    var query = 'SELECT * FROM users WHERE email=$1 AND type=$2';
    pool.query(query, [email, roll], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.checkSocialExists = function(data, callback) {
    var search = '';
    if(data.google_id) {
        search += `  AND google_id='${data.google_id}'`;         
    }

    if(data.facebook_id) {
        search += `  AND facebook_id='${data.facebook_id}'`;         
    }
    
    var query = `SELECT id,firstname,lastname,avatar,type FROM users WHERE email='${data.email}' AND type=${data.type}`+ search;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.updateSocial = function(client, data, callback) {
    var update=''
    if(data.google_id) {
        update += ` google_id='${data.google_id}' `;         
    }

    if(data.facebook_id) {
        update += ` facebook_id='${data.facebook_id}' `;         
    }
    var query = `UPDATE users SET ${update},updated_at=Default WHERE id=${data.id} RETURNING id,firstname,lastname,avatar,type`;
    client.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null,result.rows);
        }
    });
}

exports.userSearchCount = function(data, callback) {
    var type = data.type ? parseInt(data.type, 10) : 1;
    var search = '';
    if(data.firstname) {
        data.firstname = data.firstname.replace(/(\')+/g,"''");
        search += `  AND firstname ILIKE '%${data.firstname}%'`;         
    }
    if(data.lastname) {
        data.lastname = data.lastname.replace(/(\')+/g,"''");
        search += `  AND lastname ILIKE '%${data.lastname}%'`;
    }
    if(data.email) {
        data.email = data.email.replace(/(\')+/g,"''");
        search += `  AND email ILIKE '%${data.email}%'`;
    }

    if(data.category_id) {
        search += `  AND category_id=${data.category_id}`;
    }

    if(data.in_team == 1 || data.in_team == 0) {
        search += `  AND in_team=${data.in_team}`;
    }
    var query = `SELECT
                  count(*) AS total
              FROM users
              WHERE type=${type} AND status=1`+search;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getUserByType = function(data, callback) {
    var type = data.type ? parseInt(data.type, 10) : 1;
    var offset = 0;
    var page = data.page ? parseInt(data.page, 10) : 1;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;
    if(page){
        offset = (page-1)*recordPerPage;
    }
    var search = '';
    if(data.firstname) {
        data.firstname = data.firstname.replace(/(\')+/g,"''");
        search += `  AND firstname ILIKE '%${data.firstname}%'`;         
    }
    if(data.lastname) {
        data.lastname = data.lastname.replace(/(\')+/g,"''");
        search += `  AND lastname ILIKE '%${data.lastname}%'`;
    }
    if(data.email) {
        data.email = data.email.replace(/(\')+/g,"''");
        search += `  AND email ILIKE '%${data.email}%'`;
    }
    if(data.category_id) {
        search += `  AND category_id=${data.category_id}`;
    }
    if(data.in_team == 1 || data.in_team == 0) {
        search += `  AND in_team=${data.in_team}`;
    }
    var orderby = '';
    if(data.orderby){
        var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        orderby = ` ORDER BY ${data.orderby} ${orderbydirection}`
    
    }else{
        orderby = ` ORDER BY created_at ASC`    
    }
    var query = `SELECT u.id, u.email, u.firstname, u.lastname, u.avatar, u.status, u.seq_no,
    (SELECT COUNT(ub.id) FROM user_badges ub WHERE ub.user_id = u.id and ub.ubadge_id = 1) as topcontrib
                    FROM users u
                    WHERE type=${type} AND status=1`+search+orderby+`
                    LIMIT ${recordPerPage}
                    OFFSET ${offset}` ;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getUsersAll = function(data, callback) {
    var type = data.type ? parseInt(data.type, 10) : 1;
    var offset = 0;
    var page = data.page ? parseInt(data.page, 10) : 1;
    var recordPerPage = data.recordPerPage ? parseInt(data.recordPerPage, 10) : 10;
    if(page){
        offset = (page-1)*recordPerPage;
    }
    var search = '';
    
    var query = `SELECT u.id, u.email, u.firstname, u.lastname
                    FROM users u
                    WHERE type=${type} AND status=1 `+search+`
                    ORDER BY u.lastname ASC
                    OFFSET ${offset}` ;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.checkEmailExist = function(email, callback) {

    var query = 'SELECT * FROM users WHERE email=$1';
    pool.query(query, [email], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.chekcUserExists = function(user_id, callback) {

    var query = 'SELECT * FROM users WHERE id=$1';
    pool.query(query, [user_id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.checkIPLogExists = function(client, ipaddress, callback) {

    var query = `
    INSERT INTO ip_log(
        ipaddress, datetime, stopshowing)
    VALUES ( $1, NOW(), 'False')
    ON CONFLICT (ipaddress)
    DO UPDATE SET datetime = NOW(); 
    SELECT stopshowing FROM ip_log WHERE ipaddress=$1;    
    `;
    var query2 = 'SELECT stopshowing FROM ip_log WHERE ipaddress=$1;   ';
    if (client) {
        console.log('client');
        client.query(query, [ipaddress], function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result.rows);
            }
        });
    } else {
        console.log('pool')
        pool.query(query, [ipaddress], function(err, result) {
            if (err) {
                //callback(err);
            } else {
                //callback(null, result.rows);
            }
        });

        pool.query(query2, [ipaddress], function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result.rows);
            }
        });
    }
}

/*
 * Model call from auth/activationController
 *
 *
 */
exports.activateUser = function(client, id, callback) {

    var query = 'UPDATE users SET status=$1,updated_at=Default WHERE id=$2';
    client.query(query, [1, id], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}


/*
 * Model call from auth/change.status.controller
 *
 *
 */
exports.changeStatus = function(id, status, callback) {
    console.log(status);
    var query = 'UPDATE users SET status=$1, in_team=0, updated_at=Default WHERE id=$2';
    pool.query(query, [status, id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

exports.toggleTopContributor = function(id, status, callback) {
    console.log(status);
    var query = 'UPDATE users SET status=$1, in_team=0, updated_at=Default WHERE id=$2';
    pool.query(query, [status, id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

/*
 * Model call from password/change.password.controller
 *                 password/check.current.password.controller
 *                 payment/purchaseController
 *                 auth/parentLoginController
 *                 auth/reportAbuse.controller
 *
 */
exports.getUserById = function(id, callback) {

    var query = 'SELECT * FROM users WHERE id=$1';
    pool.query(query, [id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

/*
 * Model call from password/change.password.controller
 *                 password/child.forgot.password.controller
 *
 */
exports.updatePassword = function(client, id, password, callback) {

    var query = 'UPDATE users SET password=$1,is_manual=1,updated_at=Default WHERE id=$2';
    if (client) {
        client.query(query, [password, id], function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    } else {
        pool.query(query, [password, id], function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });
    }
}

/*
 * Model call from password/forgot.password.controller
 *
 *
 */
exports.checkEmail = function(email, callback) {
    var query = 'SELECT * FROM users WHERE email=$1';
    pool.query(query, [email], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.getUserProfile = function(client, id, callback) {

    var query = `SELECT
                  id,
                  email,                  
                  firstname,
                  lastname,
                  avatar, 
                  gender,
                  mobile,
                  bio,
                  university_id,
                  category_id,
                  country_id,
                  seq_no,
                  role,
                  (SELECT name FROM universities i WHERE u.university_id = i.id) AS university,
                  (SELECT name FROM countries i WHERE u.country_id = i.id) AS country
                FROM users u                 
                WHERE id=$1`;
    if (client) {
        client.query(query, [id], function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result.rows);
            }
        });
    } else {
        pool.query(query, [id], function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result.rows);
            }
        });
    }
}


/*
 * Model call from admin/update.parent.Controller
 *
 */
exports.updateUser = (client, data, callback) => {
    var query = `
        UPDATE
          users
        SET                  
          firstname=$1,
          lastname=$2,
          avatar=$3, 
          gender=$4,
          mobile=$5,
          bio=$6,
          university_id=$7,
          category_id=$8,
          country_id=$9,
          updated_at=Default,
          role=$10,
          email=$11,
          seq_no=$12
        WHERE
          id=$13 RETURNING id,firstname,lastname,avatar,type`;

    var dataArray = [
        data.firstname,
        data.lastname,
        data.avatar,
        data.gender,
        data.mobile,
        data.bio,
        data.university_id,
        data.category_id,
        data.country_id,
        data.role,
        data.email,
        data.seq_no || 1,
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

exports.setTopBadge = (data, callback) => {
    var delQuery = "DELETE FROM user_badges WHERE user_id = $1";
            var insQuery = "INSERT INTO user_badges (user_id,ubadge_id) VALUES ($1,1)";
    var query = `
    SELECT COUNT(id) AS badgecount FROM user_badges WHERE user_id = $1`;
console.log('in top badge');
    var dataArray = [
        data.user_id
    ];
    
    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            
            if(Number(result.rows[0].badgecount > 0))
            {
                pool.query(delQuery,dataArray);
            }
            else
            {
                pool.query(insQuery,dataArray);
            } 
            callback(null, result);
        }
    });
}




exports.setInTeam = (data, callback) => {
    var query = `
        UPDATE
          users
        SET 
          in_team=$1,
          updated_at=Default
        WHERE
          id=$2`;

    var dataArray = [
        Number(data.in_team),
        data.user_id
    ];
    
    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}



exports.getTeamMembers = (data, callback) => {
    var query = `SELECT
                  U.id,                  
                  U.firstname,
                  U.lastname,
                  U.avatar,
                  U.role,
                  U.bio,
                  U.seq_no,
                  U.category_id,
                  U.created_at,
                  CONCAT(U.firstname, ' ', U.lastname) AS username,
                  C.name AS category
                FROM users U        
                LEFT JOIN category C ON (U.category_id = C.id)
                WHERE U.in_team=1
                ORDER BY C.seq_no ASC,U.seq_no ASC`;
    
        pool.query(query, function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result.rows);
            }
        });
}