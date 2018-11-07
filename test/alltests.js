global.appRoot = __dirname;
global.config = require('../config/config');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = require('../server');
require('./user');
require('./systemdata');


describe('Stop server in end', function () {
    it('Server should stop manually to get code coverage', function (done) {
        app.close(function name () {
            done();
        });
    });
});
