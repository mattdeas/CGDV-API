'use strict';

/**
 * Module dependencies
 */

const validate = require('../validate/countryValidate');
const path = require('path');
const stratagy = require(path.resolve('modules/stratagy'));

module.exports = function(app) {
    // user Controller
    var country = require('../controllers/countryController');
    
    app.route('/api/country')
        .get(
            country.getCountryList
        )
        .post(
        	stratagy.isAdmin,
            validate.countryAdd,
            country.countryAdd
        );
    app.route('/api/country/:id')
        .put(
            stratagy.isAdmin,
            validate.countryAdd,
            country.updateCountry
        )
        .delete(
            stratagy.isAdmin,
            country.deleteCountry
        )
};