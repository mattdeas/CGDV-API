'use strict';

/**
 * Module dependencies
 */

const validate = require('../validate/userValidate');
const path = require('path');
const stratagy = require(path.resolve('modules/stratagy'));

module.exports = function(app) {
    // user Controller

    //togglebadge(user_id, badge_id): Observable<any> {
    //    return this.http.put(API_URL+'api/user/badges/'+user_id,badge_id);
    //  }

    var user = require('../controllers/userController');

    app.route('/api/user/register')
        .post(
            stratagy.isAdmin,
            validate.registerUser,
            user.userRegister
        );
    app.route('/api/user/badges')
    .put(
        stratagy.isAdmin,
        user.toggleTopBadge
    );
    app.route('/api/admin/register')
        .post(
            stratagy.isSuperAdmin,
            validate.registerUser,
            user.adminRegister
        );
    app.route('/api/user')
        .get(
            stratagy.isAdmin,
            user.getUserList
        );
    app.route('/api/user/listall')
        .get(
            user.getUserListAll
        );
    app.route('/api/user/inTeam')
        .get(            
            user.getTeamMembers
        )
        .put(
            stratagy.isAdmin,
            user.setInTeam
        );

    app.route('/api/user/:id')
        .get(
            //stratagy.isAuthorized,
            user.getUserProfile
        )
        .put(
            stratagy.isAuthorized,
            user.updateUserProfile
        )
        .delete(
            stratagy.isAdmin,
            user.deleteUser
        );
    app.route('/api/userip/:ipaddress')
            .get(
                user.getIPAddressInfo
            );
};