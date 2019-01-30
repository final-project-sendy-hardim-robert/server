const chai = require('chai')
const expect = chai.expect
const chaiHTTP = require('chai-http')
const app = require('../app.js')
const helper = require('../helper/userHelper.js')
const redis = require("redis"),
    client = redis.createClient();
chai.use(chaiHTTP);
const moxios = require('moxios');
const EMAIL = 'test@gmail.com'
const PASSWORD = '123456';
const axios = require('axios');
let token = '';
const sinon = require('sinon');
const { equal } = require('assert');
const weatherController = require('../controllers/weatherController');

describe('Testing weather feature', function () {
    before(function (done) {
      helper.create(done);
    })

    before (function(done) {
      chai.request(app)
        .post('/users/login')
        .send({ email: EMAIL, password: PASSWORD })
        .end(function (err, res) {
            token = res.body.token
            done()
        })
    })

    it('should return data when all parameter is provided', (done) => {
        chai.request(app)
            .get('/weather')
            .set({ token: token })
            .query({ latitude: 1, longitude: -1})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.keys(['data', 'info']);
                done()
            })
    })

    it('should return cached data when all parameter is provided', (done) => {
      chai.request(app)
          .get('/weather')
          .set({ token: token })
          .query({ latitude: 1, longitude: -1})
          .end(function (err, res) {
              expect(res).to.have.status(200);
              expect(res.body).to.have.keys(['data', 'info']);
              done()
          })
    })

    it('should return one data when all parameter is provided', (done) => {
      chai.request(app)
          .get('/weather/now')
          .set({ token: token })
          .query({ latitude: 1, longitude: -1})
          .end(function (err, res) {
              expect(res).to.have.status(200);
              expect(res.body).to.have.keys(['data', 'info']);
              done()
          })
    })

  it('should return one data when all parameter is provided', (done) => {
    chai.request(app)
        .get('/weather/now')
        .set({ token: token })
        .query({ latitude: 1, longitude: -1})
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.have.keys(['data', 'info']);
            done()
        })
  })

  it('should return error  for /weather when request to api is failed', (done) => {
    beforeEach(() => {
       moxios.install();
    })

    afterEach(() => {
      moxios.uninstall();
    })

    moxios.withMock(() => {
      let onFulfilled = sinon.spy();
      axios.get('/weather')
        .then(onFulfilled)
        .catch(onFulfilled)
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 500,
          response: {
            info: 'failed to get data',
            err: 'Something happen'
          }
        })
        .then((res) => {
          expect(res.data.info).equal('failed to get data')
          expect(res.data.err).equal('Something happen')
          done()
        })
      })
    })
  })

  it('should return error for /weathers/now when request to api is failed', (done) => {
    beforeEach(() => {
       moxios.install();
    })

    afterEach(() => {
      moxios.uninstall();
    })

    moxios.withMock(() => {
      let onFulfilled = sinon.spy();
      axios.get('/weather/now')
      .then(onFulfilled)
      .catch(onFulfilled);
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 500,
          response: {
            info: 'failed to get data',
            err: 'Something happen'
          }
        })
        .then((res) => {
          expect(res.data.info).equal('failed to get data')
          expect(res.data.err).equal('Something happen')
          done()
        })
        .catch((err) => {
          done(err)
        })
      })
    })
  })

    after(function(done) {
      client.flushall(() => {
      })
      helper.delete(done);
    })
})