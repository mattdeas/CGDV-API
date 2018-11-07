const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
const request = require('supertest');
const app = require('../../server');
request(app);
var UsersTest = require('./testdata/users-testdata');
const fs = require('fs');

describe('User Register:->', () => {
    UsersTest.usersignup.forEach(testCase => {
        it(testCase.it, function (done) {
            request(config.unittestUrl)
                .post('/api/auth/user/register')
                .send(testCase.data)
                .end(function (error, res) {
                    assert.equal(testCase.status, res.body.status);
                    done();
                });
        });
    });
});



describe('User signIn :->', () => {
    UsersTest.userSignIn.forEach(testCase => {
        it(testCase.it, function (done) {
            request(config.unittestUrl)
                .post('/api/auth/user/login')
                .send(testCase.data)
                .end(function (error, res) {
                    assert.equal(testCase.status, res.body.status);
                    done();
                });
        });
    });
});

describe('Admin signIn :->', () => {
    UsersTest.adminSignIn.forEach(testCase => {
        it(testCase.it, function (done) {
            request(config.unittestUrl)
                .post('/api/auth/admin/login')
                .send(testCase.data)
                .end(function (error, res) {
                    if (res.body.status) {
                        fs.appendFile('/tmp/token.txt', res.body, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                    }
                    assert.equal(testCase.status, res.body.status);
                    done();
                });
        });
    });
});
