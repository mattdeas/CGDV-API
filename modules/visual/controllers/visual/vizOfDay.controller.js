'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
    Visual = require(path.resolve('models/Visual')),
    pool = require(path.resolve('lib/db')),
    async = require('async'), 
    helper = require(path.resolve('common/helper')),
    Boom = require(path.resolve('languages/en/errors'));

exports.getVizOfDay = function (req, res, next) {
  
  async.parallel([
    function (callback) {
      Visual.vizOfDaySearchCount(req.query, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result[0]);
        }
      });
    },
    function (callback) {      
      Visual.getVizOfDayList(req.query, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  ],
  function (err, results) {
    if (err) {
      next(err);
    } else {      
      var data = { };
      data.count = parseInt(results[0].total, 10);
      data.currentPage = req.query.page ? parseInt(req.query.page, 10) : 1;
      data.data = results[1];

      let message;
      if(!results[1].length){
        message = 'No Data found';
      } else {
        message = 'Success';
      }

      res.json({ status: 1, message: message, result: data });
    }
  });

}; 
exports.getNotInVizOfDay = function(req, res, next) {
    async.parallel([
    function (callback) {
      Visual.notInVizOfDaySearchCount(req.query, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result[0]);
        }
      });
    },
    function (callback) {      
      Visual.getNotInVizOfDayList(req.query, function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  ],
  function (err, results) {
    if (err) {
      next(err);
    } else {      
      var data = { };
      data.count = parseInt(results[0].total, 10);
      data.currentPage = req.query.page ? parseInt(req.query.page, 10) : 1;
      data.data = results[1];

      let message;
      if(!results[1].length){
        message = 'No Data found';
      } else {
        message = 'Success';
      }

      res.json({ status: 1, message: message, result: data });
    }
  });
}

exports.setVizOfDay = function (req, res, next) {  
  
  let viz_id = req.body.viz_id;
  let category_id = req.body.category_id;
  let addFlag = req.body.addFlag;
  
  async.waterfall([
      chekcVisualExists,
      checkNUpdateVizList,
      updateVizOfDay,
      success
    ], function(err) {
      next(err);
    });


    function chekcVisualExists(callback) {
      Visual.getVisualById(viz_id, function(err, results) {
        if (err) {
          callback(err);
        } else if (!results.length) {
          return res.status(Boom.NO_DATA_FOUND.statusCode).json(Boom.NO_DATA_FOUND);
        } else {
          callback(null);
        }
      });
    }

    function checkNUpdateVizList(callback) {
      let vizlist = [];
      if(addFlag == true){//set as viz of day if not already set
        Visual.getVizOfDayById(category_id, viz_id, function(err, results) {
            if (err) {
                next(err);
            } else if (results.length) {
                return res.status(Boom.ALREADY_THERE.statusCode).json(Boom.ALREADY_THERE);
            } else {                
                callback(null, category_id, viz_id, addFlag);
            }
        });
      }else if(addFlag == false){//remove as viz of day if set before
        Visual.getVizOfDayById(category_id, viz_id, function(err, results) {
            if (err) {
                next(err);
            } else if (results.length) {
                callback(null, category_id, viz_id, addFlag);
            } else {                
                return res.status(Boom.NO_DATA_FOUND.statusCode).json(Boom.NO_DATA_FOUND);
            }
        });
      }else{
        return res.status(Boom.NO_DATA_FOUND.statusCode).json(Boom.NO_DATA_FOUND);
      }
    }

    function updateVizOfDay(category_id, viz_id, addFlag, callback) {
      Visual.updateVizOfDay(category_id, viz_id, addFlag, function(err, results) {
        if (err) {
          callback(err);
        } else {
          callback(null, results[0]);
        }
      });
    }    

    function success(result, callback) {
      return res.json({ status: 1, message: 'Updated successfully'});
    }
}