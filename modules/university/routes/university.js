'use strict';

/**
 * Module dependencies
 */

const validate = require('../validate/universityValidate');
const path = require('path');
const stratagy = require(path.resolve('modules/stratagy'));

module.exports = function(app) {
    
    var university = require('../controllers/universityController');

   
    app.route('/api/university')
        .get(            
            university.getUniversityList
        )
        .post(
        	// stratagy.isAuthorized,
        	validate.universityAdd,
            university.universityAdd
        );
    app.route('/api/university/:id')
        .put(
            stratagy.isAdmin,
            validate.universityAdd,
            university.updateUniversity
        )
        .delete(
            stratagy.isAdmin,
            university.deleteUniversity
        )
};