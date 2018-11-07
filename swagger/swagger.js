

const swaggerTools = require('swagger-tools');
var swaggerJson = require('./swagger.json');
require('./genericResponse');

const config = require('../config/config');
swaggerJson.definitions = {};
global.languageConst = {
    'in': 'header',
    'name': 'Accept-Language',
    'description': 'Select language.',
    'required': true,
    'type': 'string',
    'enum': ['en', 'de']
};
global.accessToken = {
    'in': 'header',
    'name': 'accessToken',
    'description': 'Access Token',
    'required': false,
    'type': 'string'
};

global.deviceOSConst = {
    'in': 'header',
    'name': 'deviceos',
    'description': 'Select deviceOS.',
    'required': true,
    'type': 'string',
    'enum': ['android', 'iOS']
};
global.tokenConst = {
    'in': 'header',
    'name': 'x-access-token',
    'description': 'Add accesstoken.',
    'required': false,
    'type': 'string'
};
swaggerJson = require('./authSwagger')(swaggerJson);
var options = {
    swaggerUi: '/swagger.json',
    controllers: './lib'
};
var local = process.env.NODE_ENV === 'local';
var test = process.env.NODE_ENV === 'testing';
var backendUrl = config.server.secure ? 'localhost:8443' : 'localhost:8080';

// var host = backendUrl.split('://');
swaggerJson.host = backendUrl;
swaggerJson.info.description = 'HostName / URL : ' + swaggerJson.host;
swaggerJson.schemes[0] = config.server.secure ? 'https' : 'http' ;

module.exports = function (app) {

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerJson, function (middleware) {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        app.use(middleware.swaggerMetadata());

        // Validate Swagger requests
        app.use(middleware.swaggerValidator());

        // Route validated requests to appropriate controller
        app.use(middleware.swaggerRouter(options));

        // Serve the Swagger documents and Swagger UI
        app.use(middleware.swaggerUi());
    });
};
