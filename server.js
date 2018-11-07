'use strict';

/**
 * Module dependencies.
 */
var chalk = require('chalk'),
    fs = require('fs'),
    http = require('http'),
    https = require('https');
var app = require('./lib/app');
var init = app.init();
var server;
if (init.config && init.app) {
    var config = init.config;
    app = init.app;
    if (config.server.secure) {
        var certifications = {
            key: fs.readFileSync(config.server.certificates.path + config.server.certificates.key),
            cert: fs.readFileSync(config.server.certificates.path + config.server.certificates.crt)
        };

        // Start the app by listening on <port> at <host>
        server = https.createServer(certifications, app)
            .listen(config.server.https_port, config.server.host, function() {
                // Create server URL
                var serverURL = 'https://' + config.server.host + ':' + config.server.https_port;
                // Logging initialization
                console.log(chalk.green(config.app.title));
                console.log();
                console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
                console.log(chalk.green('Server:          ' + serverURL));
                console.log();
            });
    } else {
        // Start the app by listening on <port> at <host>
        server = http.createServer(app)
            .listen(config.server.http_port, config.server.host, function() {
                // Create server URL
                var serverURL = 'http://' + config.server.host + ':' + config.server.http_port;
                // Logging initialization
                console.log(chalk.green(config.app.title));
                console.log();
                console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
                console.log(chalk.green('Server:          ' + serverURL));
                console.log();
            });
    }
}

module.exports = server;