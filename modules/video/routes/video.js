'use strict';

/**
 * Module dependencies
 */

const validate = require('../validate/videoValidate');
const path = require('path');
const stratagy = require(path.resolve('modules/stratagy'));

module.exports = function(app) {
    // user Controller
    var video = require('../controllers/videoController');    

    app.route('/api/video')
        .get(
            video.getVideoList
        )
        .post(
            stratagy.isAdmin,
            video.videoAdd
        );

    

    app.route('/api/video/:id')
        .put(
            stratagy.isAdmin,
            video.updateVideo
        )
        .delete(
            stratagy.isAdmin,
            video.deleteVideo
        );        
     
};


