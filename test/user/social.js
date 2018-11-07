const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
const request = require('supertest');
const app = require('../../server');
const fs = require('fs');
request(app);

var UsersTest = require('./testdata/users-testdata');

describe('Social Register:->', () => {
    UsersTest.socialLogin.forEach(testCase => {
        it(testCase.it, function (done) {
            request(config.unittestUrl)
                .post('/api/auth/user/socialSignIn')
                .send(testCase.data)
                .end(function (error, res) {
                    assert.equal( testCase.status, res.body.status);
                    if (res.body.status === 1) {
                        global.globalUserAccessToken = res.body.result.token;
                        global.id = res.body.result.id;
                        fs.appendFile('/tmp/usertoken.txt', res.body, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                    }
                    done();
                });
        });
    });
});
