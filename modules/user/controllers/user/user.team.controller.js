'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  User = require(path.resolve('models/User')),
  async = require('async'),
  Boom = require(path.resolve('languages/en/errors'));



/**
 * get user which are team member by team id(category_id)
 *
 *
 */
exports.getTeamMembers = function (req, res, next) {    
  User.getTeamMembers(req.query, function (err, results) {
    if (err) {
      next(err);
    } else {    
      let message, data = {};
      if(!results.length){
        message = 'No Data found';
      } else {
        message = 'Success';
        results.forEach(function(item){
          data[item.category] = data[item.category] ? data[item.category] : [];          
          data[item.category].push(item);
        })

      }

      res.json({ status: 1, message: message, result: data });
    } 
  });

};

/**
 * set user in team or not
 *
 *   == 
 */
exports.setInTeam = function (req, res, next) {    
  User.setInTeam(req.body, function (err, results) {
    if (err) {
      next(err);
    } else {    
      res.json({ status: 1, message: 'Success' });
    } 
  });

};