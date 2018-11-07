const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
const request = require('supertest');
const app = require('../../server');
request(app);

describe('SystemData:->', () => {
    it('Country Drop down list', function (done) {
        request(config.unittestUrl)
            .get('/api/country')
            .end(function (error, res) {
                assert.equal( 1, res.body.status);
                done();
            }); });
});


describe('SystemData:->', () => {
    it('Category Drop down list', function (done) {
        request(config.unittestUrl)
            .get('/api/category')
            .end(function (error, res) {
                assert.equal( 1, res.body.status);
                done();
            }); });
});


describe('SystemData:->', () => {
    it('University Drop down list', function (done) {
        request(config.unittestUrl)
            .get('/api/university')
            .end(function (error, res) {
                assert.equal( 1, res.body.status);
                done();
            }); });
});

