'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
	pool = require(path.resolve('lib/db'));



//----------------about----------------
/*
 * get homepage about
 *
*/
exports.getHomepageAbout = function(callback){

  var query = 'SELECT content FROM homepage_about';
  pool.query(query, function(err, result){
    if(err){
      callback(err);
    } else {
      callback(null, result.rows);
    }
  });
}

/*
 * add homepage about
 *
*/
exports.addHomepageAbout = function(client, data, callback){

  var query = `
        INSERT INTO
          homepage_about
            (                
              content
            )
    VALUES ( $1 ) RETURNING id`;


    var dataArray = [
        data.content
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

/*
 * update homepage about
 *
*/
exports.updateHomepageAbout = (data, callback) => {
    var query = `
        UPDATE
          homepage_about
        SET                  
          content=$1,
          updated_at=Default`;

    var dataArray = [
        data.content
    ];
    
    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

/*
 * get homepage about
 *
*/
exports.getHomepageVideoSection = function(callback){

  var query = 'SELECT text_typed,text_content FROM homepage_video_section';
  pool.query(query, function(err, result){
    if(err){
      callback(err);
    } else {
      callback(null, result.rows);
    }
  });
}

/*
 * add  Homepage Video Section
 *
*/
exports.addHomepageVideoSection = function(client, data, callback){

  var query = `
        INSERT INTO
          homepage_video_section
            (                
              text_typed,
              text_content
            )
    VALUES ( $1, $2 ) RETURNING id`;


    var dataArray = [
        data.text_typed,
        data.text_content
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

/*
 * update Homepage Video Section
 *
*/
exports.updateHomepageVideoSection = (data, callback) => {
    var query = `
        UPDATE
          homepage_video_section
        SET                  
          text_typed=$1,
          text_content=$2,
          updated_at=Default`;

    var dataArray = [
        data.text_typed,
        data.text_content
    ];
    
    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

/*
 * get aboutpage about
 *
*/
exports.getAboutpageAbout = function(callback){

  var query = 'SELECT content FROM aboutpage_about';
  pool.query(query, function(err, result){
    if(err){
      callback(err);
    } else {
      callback(null, result.rows);
    }
  });
}
/*
 * add Aboutpage about
 *
*/
exports.addAboutpageAbout = function(client, data, callback){

  var query = `
        INSERT INTO
          aboutpage_about
            (                
              content
            )
    VALUES ( $1 ) RETURNING id`;


    var dataArray = [
        data.content
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
/*
 * update aboutpage about
 *
*/
exports.updateAboutpageAbout = (data, callback) => {
    var query = `
        UPDATE
          aboutpage_about
        SET                  
          content=$1,
          updated_at=Default`;

    var dataArray = [
        data.content
    ];
    
    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}
//----------------about page----------------


//----------------partners section----------------
/*
 * get getPartnersList
*/
/*
 * get getNewsList
*/
exports.partnerSearchCount = function(data, callback) {
    var search = '';
    if(data.title) {
        data.title = data.title.replace(/(\')+/g,"''");
        search += `  AND title ILIKE '%${data.title}%'`;
    }
    
    var query = `SELECT
                  count(*) AS total
              FROM cms_partners
              WHERE TRUE `+search;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getPartner = function(data, callback) {
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
    if(data.title) {
        data.title = data.title.replace(/(\')+/g,"''");
        search += `  AND title ILIKE '%${data.title}%'`;         
    }
    var orderby = '';
    if(data.orderby){
        var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        orderby = ` ORDER BY ${data.orderby} ${orderbydirection}`
    
    }else{
        orderby = ` ORDER BY id ASC`    
    }
    var query = `SELECT * 
                    FROM cms_partners 
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

exports.checkPartnerExistsById = function(id, callback) {

    var query = 'SELECT * FROM cms_partners WHERE id=$1';
    pool.query(query, [id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.addPartner = function(data, callback) {

   var query = `
        INSERT INTO
          cms_partners
            (                
              avatar,
              title,
              link
            )
    VALUES ( $1, $2, $3  ) RETURNING id`;


    var dataArray = [
        data.avatar,
        data.title,
        data.link
    ];

    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.updatePartner = (client, data, callback) => {
    var query = `
        UPDATE
          cms_partners
        SET                  
          avatar=$1,
          title=$2,
          link=$3,
          updated_at=Default
        WHERE
          id=$4`;

    var dataArray = [
        data.avatar,
        data.title,
        data.link,
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

exports.deletePartner = function(id,  callback) {
    var query = `DELETE
            FROM
              cms_partners
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

//----------------partners section----------------



//----------------news section----------------
/*
 * get getNewsList
*/
exports.newsSearchCount = function(data, callback) {
    var search = '';
    if(data.content) {
        data.content = data.content.replace(/(\')+/g,"''");
        search += `  AND content ILIKE '%${data.content}%'`;
    }
    
    var query = `SELECT
                  count(*) AS total
              FROM cms_news
              WHERE TRUE `+search;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getNews = function(data, callback) {
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
    if(data.content) {
        data.content = data.content.replace(/(\')+/g,"''");
        search += `  AND content ILIKE '%${data.content}%'`;         
    }
    var orderby = '';
    if(data.orderby){
        var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        orderby = ` ORDER BY ${data.orderby} ${orderbydirection}`
    
    }else{
        orderby = ` ORDER BY id ASC`    
    }
    var query = `SELECT * 
                    FROM cms_news 
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

exports.checkNewsExistsById = function(id, callback) {

    var query = 'SELECT * FROM cms_news WHERE id=$1';
    pool.query(query, [id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.addNews = function(data, callback) {

   var query = `
        INSERT INTO
          cms_news
            (                
              content,
              link
            )
    VALUES ( $1, $2  ) RETURNING id`;


    var dataArray = [
        data.content,
        data.link
    ];

    pool.query(query, dataArray, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.updateNews = (client, data, callback) => {
    var query = `
        UPDATE
          cms_news
        SET                  
          content=$1,
          link=$2,
          updated_at=Default
        WHERE
          id=$3`;

    var dataArray = [
        data.content,
        data.link,
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

exports.deleteNews = function(id,  callback) {
    var query = `DELETE
            FROM
              cms_news
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

//----------------news section----------------


//----------------journey section----------------
/*
 * get getJourneyList
*/
exports.journeySearchCount = function(data, callback) {
    var search = '';
    if(data.nav_title) {
        data.nav_title = data.nav_title.replace(/(\')+/g,"''");
        search += `  AND nav_title ILIKE '%${data.nav_title}%'`;
    }
    if(data.header) {
        data.header = data.header.replace(/(\')+/g,"''");
        search += `  AND header ILIKE '%${data.header}%'`;
    }
    if(data.content) {
        data.content = data.content.replace(/(\')+/g,"''");
        search += `  AND content ILIKE '%${data.content}%'`;
    }
    
    var query = `SELECT
                  count(*) AS total
              FROM cms_journey
              WHERE TRUE `+search;
    pool.query(query, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}

exports.getJourney = function(data, callback) {
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
    if(data.nav_title) {
        data.nav_title = data.nav_title.replace(/(\')+/g,"''");
        search += `  AND nav_title ILIKE '%${data.nav_title}%'`;
    }
    if(data.header) {
        data.header = data.header.replace(/(\')+/g,"''");
        search += `  AND header ILIKE '%${data.header}%'`;
    }
    if(data.content) {
        data.content = data.content.replace(/(\')+/g,"''");
        search += `  AND content ILIKE '%${data.content}%'`;
    }
    var orderby = '';
    if(data.orderby){
        var orderbydirection = data.orderbydirection ? data.orderbydirection.toUpperCase() : 'DESC'
        orderby = ` ORDER BY ${data.orderby} ${orderbydirection}`
    
    }else{
        orderby = ` ORDER BY seq_no ASC`    
    }
    var query = `SELECT * 
                    FROM cms_journey 
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

exports.checkJourneyExistsById = function(id, callback) {

    var query = 'SELECT * FROM cms_journey WHERE id=$1';
    pool.query(query, [id], function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.rows);
        }
    });
}


exports.addJourney = function(data, callback) {

   var query = `
        INSERT INTO
          cms_journey
            (                
              nav_title,
              header,
              content,
              avatar,
              seq_no
            )
    VALUES ( $1,$2,$3,$4,$5  ) RETURNING id`;


    var dataArray = [
        data.nav_title,
        data.header,
        data.content,
        data.avatar,
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


exports.updateJourney = (client, data, callback) => {
    var query = `
        UPDATE
          cms_journey
        SET                  
          nav_title=$1,
          header=$2,
          content=$3,
          avatar=$4,
          seq_no=$5,
          updated_at=Default
        WHERE
          id=$6`;

    var dataArray = [
        data.nav_title,
        data.header,
        data.content,
        data.avatar,
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

exports.deleteJourney = function(id,  callback) {
    var query = `DELETE
            FROM
              cms_journey
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

//----------------journey section----------------