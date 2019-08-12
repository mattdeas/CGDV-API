'use strict';

/**
 * Module dependencies
 */

const validate = require('../validate/challengeValidate');
const path = require('path');
const stratagy = require(path.resolve('modules/stratagy'));

module.exports = function(app) {
    // user Controller
    var challenge = require('../controllers/challengeController');

    app.route('/api/challenge')
        .get(
            challenge.getChallengeList
        )
        .post(
            stratagy.isAdmin,
            challenge.challengeAdd
        );
    app.route('/api/challengelist')
        .get(
            challenge.getChallengeListDropDown
        );
    app.route('/api/challengelistall')
        .get(
            challenge.getChallengeListDropDownALL
        );
    app.route('/api/challenge/:id')
    .get(
        challenge.getChallengeList
    )
    .put(
        stratagy.isAdmin,
        challenge.updateChallenge
    )
    .delete(
        stratagy.isAdmin,
        challenge.deleteChallenge
    );;
         
     
}


