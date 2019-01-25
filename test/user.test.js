const chai = require('chai')
const expect = chai.expect
const chaiHTTP = require('chai-http')
const app = require('../app.js')
const helper = require('../helper/userHelper.js');
chai.use(chaiHTTP);

const EMAIL = 'test@gmail.com'
const PASSWORD = '123456'

describe('Testing login feature', function() {
  before(function(done) {
    helper.create(done);
  })

  it('should return token when email and password is valid', (done) => {
      chai.request(app)
        .post('/users/login')
        .send({ email: EMAIL, password: PASSWORD })
        .end(function(err, res)  {
          expect(res).to.have.status(200);
          expect(res.body).to.have.keys(['token', 'user']);
          done()
        })
  })

  it('should return error message when password is wrong', (done) => {
    chai.request(app)
      .post('/users/login')
      .send({ email: EMAIL, password: 'testWrong123' })
      .end(function(err, res)  {
        expect(res).to.have.status(400);
        expect(res.body).to.have.keys(['info'])
        expect(res.body.info).to.include('incorrect password');
        done()
      })
  })

  it('should return error message when password and email are wrong', (done) => {
    chai.request(app)
      .post('/users/login')
      .send({ email: 'aaaah@gmail.com', password: 'testWrong123' })
      .end(function(err, res)  {
        expect(res).to.have.status(400);
        expect(res.body).to.have.keys(['info'])
        expect(res.body.info).to.include('incorrect email')
        done()
      })
  })

  it('should return error when user is not exist in db', (done) => {
    chai.request(app)
      .post('/users/login')
      .send({ email: 'invalid_email123@gmail.com', password: '12345' })
      .end(function(err, res)  {
        expect(res).to.have.status(400);
        expect(res.body).to.have.keys(['info'])
        expect(res.body.info).to.include('incorrect email')
        done()
      })
  })

  after(function(done) {
    helper.delete(done);
  })
})