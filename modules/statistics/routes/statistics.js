'use strict';

/**
 * Module dependencies
 */

const path = require('path');
const stratagy = require(path.resolve('modules/stratagy'));

module.exports = function(app) {
    
    var statistics = require('../controllers/statisticsController');

   
    app.route('/api/statistics')
        .get(            
            statistics.getStatistics
        );

};