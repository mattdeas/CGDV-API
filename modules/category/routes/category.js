'use strict';

/**
 * Module dependencies
 */

const validate = require('../validate/categoryValidate');
const path = require('path');
const stratagy = require(path.resolve('modules/stratagy'));

module.exports = function(app) {
    
    var category = require('../controllers/categoryController');

   
    app.route('/api/category')
        .get(            
            category.getCategoryList
        )
        .post(
        	stratagy.isAdmin,
        	validate.categoryAdd,
            category.categoryAdd
        );
    app.route('/api/category/:id')
        .put(
            stratagy.isAdmin,
            validate.categoryAdd,
            category.updateCategory
        )
        .delete(
            stratagy.isAdmin,
            category.deleteCategory
        )
};