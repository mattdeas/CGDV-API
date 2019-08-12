'use strict';

/**
 * Module dependencies
 */

const validate = require('../validate/visualValidate');
const path = require('path');
const stratagy = require(path.resolve('modules/stratagy'));

module.exports = function(app) {
    // user Controller
    var visual = require('../controllers/visualController');

    app.route('/api/visual/comment')
        .get(
            visual.getVisualCommentsList
        );
    app.route('/api/visual/comment')
        .post(
            stratagy.isAuthorized,
            visual.VisualAddComment
        );
    app.route('/api/visual/comment/:id')
    .put(
        stratagy.isAuthorized,
        visual.updateVisualComment
    )
    .delete(
        stratagy.isAuthorized,
        visual.deleteVisualComment
    );
    app.route('/api/visual')
        .get(
            stratagy.isUserDataFound,
            visual.getVisualList
        );
    app.route('/api/visualusers')
    .get(
        visual.getVisualUsers
    );
    app.route('/api/visual')
        .post(
            stratagy.isAuthorized,
            visual.VisualAdd
        );

    app.route('/api/visual/setFeatured')
        .put(
            stratagy.isAdmin,
            validate.visualSetFeatured,
            visual.setFeatured
        );
    app.route('/api/visual/setVizOfDay')
        .put(
            stratagy.isAdmin,
            visual.setVizOfDay
        );
    app.route('/api/visual/upvote')
        .put(
            stratagy.isUserDataFound,
            visual.upvote
        );
    app.route('/api/visual/:id')
        .put(
            stratagy.isAuthorized,
            visual.updateVisual
        )
        .delete(
            stratagy.isAuthorized,
            visual.deleteVisual
        );


    app.route('/api/visual/getVizOfDay')
        .get(
            visual.getVizOfDay
        );

    app.route('/api/visual/getNotInVizOfDay')
        .get(
            stratagy.isAdmin,
            visual.getNotInVizOfDay
        );
        
     
};


