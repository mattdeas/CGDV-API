'use strict';

/**
 * Module dependencies
 */

const validate = require('../validate/cmsValidate');
const path = require('path');
const stratagy = require(path.resolve('modules/stratagy'));

module.exports = function(app) {    
    var cms = require('../controllers/cmsController');
    
    app.route('/api/cms/homepage_about')
        .get(
            cms.getHomepageAbout
        )
        .post(
            stratagy.isAdmin,
            validate.updateAbout,
            cms.addHomepageAbout
        ).put(
            stratagy.isAdmin,
            validate.updateAbout,
            cms.updateHomepageAbout
        );

    app.route('/api/cms/homepage_video_section')
        .get(
            cms.getHomepageVideoSection
        )
        .post(
            stratagy.isAdmin,
            cms.addHomepageVideoSection
        ).put(
            stratagy.isAdmin,
            cms.updateHomepageVideoSection
        );
    


    app.route('/api/cms/aboutpage_about')
        .get(
            cms.getAboutpageAbout
        )
        .post(
            stratagy.isAdmin,
            validate.updateAbout,
            cms.addAboutpageAbout
        ).put(
            stratagy.isAdmin,
            validate.updateAbout,
            cms.updateAboutpageAbout
        );
    
        

    app.route('/api/cms/partner')
        .get(
            cms.getPartnersList
        )
        .post(
            stratagy.isAdmin,
            validate.addPartner,
            cms.addPartner
        );
    app.route('/api/cms/partner/:id')
        .put(
            stratagy.isAdmin,
            validate.addPartner,
            cms.updatePartner
        )
        .delete(
            stratagy.isAdmin,
            cms.deletePartner
        );


    app.route('/api/cms/news')
        .get(
            cms.getNewsList
        )
        .post(
            stratagy.isAdmin,
            validate.addNews,
            cms.addNews
        );
    app.route('/api/cms/news/:id')
        .put(
            stratagy.isAdmin,
            validate.addNews,
            cms.updateNews
        )
        .delete(
            stratagy.isAdmin,
            cms.deleteNews
        );


    app.route('/api/cms/journey')
        .get(
            cms.getJourneyList
        )
        .post(
            stratagy.isAdmin,
            validate.addJourney,
            cms.addJourney
        );
    app.route('/api/cms/journey/:id')
        .put(
            stratagy.isAdmin,
            validate.addJourney,
            cms.updateJourney
        )
        .delete(
            stratagy.isAdmin,
            cms.deleteJourney
        );
};