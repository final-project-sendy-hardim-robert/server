const chai = require('chai')
const expect = chai.expect
const chaiHTTP = require('chai-http')
const app = require('../app.js')
const helper = require('../helper/userHelper.js')
const User = require('../models/user')

chai.use(chaiHTTP);

const EMAIL = 'test@gmail.com'
const PASSWORD = '123456'

describe('Testing login feature', function () {
    before(function (done) {
        helper.create(done);
    })

    it('should return token when email and password is valid', (done) => {
        chai.request(app)
            .post('/users/login')
            .send({ email: EMAIL, password: PASSWORD })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.keys(['token', 'user']);
                done()
            })
    })

    it('should return error message when password is wrong', (done) => {
        chai.request(app)
            .post('/users/login')
            .send({ email: EMAIL, password: 'testWrong123' })
            .end(function (err, res) {
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
            .end(function (err, res) {
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
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.keys(['info'])
                expect(res.body.info).to.include('incorrect email')
                done()
            })
    })

    after(function (done) {
        helper.delete(done);
    })
})

describe('User Testing', function () {
    
    beforeEach((done) => {
        let user = {
            name: 'SendyAkbar',
            email: 'SendyAkbar@mail.com',
            phone: '08123456789',
            password: '1234567'
        }
        User
            .create(user)
            .then(user => {
                done()
            })
            .catch(err => {
                console.log(err)
                done()
            })
    })

    afterEach((done) => {
        User.remove({}, () => {
            done()
        })
    })

    describe('POST REGISTER', function () {

        it('POST /users/register should return new registered user and status 201', (done) => {
            let user = {
                name: 'haryhary',
                email: 'hary@mail.com',
                password: '123456'
            }
            chai.request(app)
                .post('/users/register')
                .send(user)
                .end((err, result) => {
                    expect(result).to.have.status(201)
                    expect(result.body).to.have.property('info')
                    expect(result.body.data).to.have.property('_id')
                    expect(result.body.data).to.have.property('name')
                    expect(result.body.data).to.have.property('email')
                    expect(result.body.data).to.have.property('password')
                    expect(result.body.data.name).to.equal('haryhary')
                    expect(result.body.data.email).to.equal('hary@mail.com')
                    expect(result.body.info).to.equal('user created successfully')
                    expect(result.body.data.phone).to.not.equal('123456')
                    done()
                })
        })

        it('POST /users/register should return error message  Email already used and status 500', (done) => {
            let user = {
                name: 'SendyAkbar',
                email: 'SendyAkbar@mail.com',
                phone: '08123456789',
                password: '1234567'
            }
            chai.request(app)
                .post('/users/register')
                .send(user)
                .end((err, result) => {
                    expect(result).to.have.status(500)
                    expect(result.body).to.have.property('info')
                    expect(result.body.info).equal('error creating user')
                    expect(result.body.data).to.have.property('message')
                    expect(result.body.data).to.have.property('errors')
                    expect(result.body.data.message).equal('User validation failed: email: Email already exist')
                    done()
                })
        })

        it('POST /users/register should return error message if field name is empty and status 500', (done) => {
            let user = {
                name: '',
                email: 'kosasih@mail.com',
                password: '123456'
            }
            chai.request(app)
                .post('/users/register')
                .send(user)
                .end((err, result) => {
                    console.log(result.body)
                    expect(result).to.have.status(500)
                    expect(result.body).to.have.property('info')
                    expect(result.body.info).equal('error creating user')
                    expect(result.body).to.have.property('data')
                    expect(result.body.data).to.have.property('message')
                    expect(result.body.data).to.have.property('errors')
                    expect(result.body.data.message).equal('User validation failed: name: name is required')
                    done()
                })
        })

        it('POST /users/register should return error message if field email is empty and status 500', (done) => {
            let user = {
                name: 'Kosasih',
                email: '',
                password: '123456'
            }
            chai.request(app)
                .post('/users/register')
                .send(user)
                .end((err, result) => {
                    expect(result).to.have.status(500)
                    expect(result.body).to.have.property('info')
                    expect(result.body.info).equal('error creating user')
                    expect(result.body).to.have.property('data')
                    expect(result.body.data).to.have.property('message')
                    expect(result.body.data).to.have.property('errors')
                    expect(result.body.data.message).equal('User validation failed: email: Email is required')
                    done()
                })
        })

        it('POST /users/register should return error message if field password is empty and status 500', (done) => {
            let user = {
                name: 'Kosasih',
                email: 'kosasih@mail.com',
                password: ''
            }
            chai.request(app)
                .post('/users/register')
                .send(user)
                .end((err, result) => {
                    expect(result).to.have.status(500)
                    expect(result.body).to.have.property('info')
                    expect(result.body.info).equal('error creating user')
                    expect(result.body).to.have.property('data')
                    expect(result.body.data).to.have.property('message')
                    expect(result.body.data).to.have.property('errors')
                    expect(result.body.data.message).equal('User validation failed: password: password is required')
                    done()
                })
        })

        it('POST /users/register should return error message if field name length is less than 5 and status 500', (done) => {
            let user = {
                name: 'kosa',
                email: 'kosasih@mail.com',
                password: '123456'
            }
            chai.request(app)
                .post('/users/register')
                .send(user)
                .end((err, result) => {
                    expect(result).to.have.status(500)
                    expect(result.body).to.have.property('info')
                    expect(result.body.info).equal('error creating user')
                    expect(result.body).to.have.property('data')
                    expect(result.body.data).to.have.property('message')
                    expect(result.body.data).to.have.property('errors')
                    expect(result.body.data.message).equal('User validation failed: name: The name field should be at least 5 characters')
                    done()
                })
        })

        it('POST /users/register should return error message if field name length is more than 20 and status 500', (done) => {
            let user = {
                name: 'kosakosakosakosakosakosasih',
                email: 'kosasih@mail.com',
                phone: '0812345678',
                password: '123456'
            }
            chai.request(app)
                .post('/users/register')
                .send(user)
                .end((err, result) => {
                    expect(result).to.have.status(500)
                    expect(result.body).to.have.property('info')
                    expect(result.body.info).equal('error creating user')
                    expect(result.body).to.have.property('data')
                    expect(result.body.data).to.have.property('message')
                    expect(result.body.data).to.have.property('errors')
                    expect(result.body.data.message).equal('User validation failed: name: The name field cannot be more than 20 characters')
                    done()
                })
        })

        it('POST /users/register should return error message if field email is not valid and status 500', (done) => {
            let user = {
                name: 'kosasih',
                email: 'kamacomcom',
                password: '123456'
            }
            chai.request(app)
                .post('/users/register')
                .send(user)
                .end((err, result) => {
                    expect(result).to.have.status(500)
                    expect(result.body).to.have.property('info')
                    expect(result.body.info).equal('error creating user')
                    expect(result.body).to.have.property('data')
                    expect(result.body.data).to.have.property('message')
                    expect(result.body.data).to.have.property('errors')
                    expect(result.body.data.message).equal('User validation failed: email: Please fill a valid email address')
                    done()
                })
        })

        it('POST /users/register should return error message if field password length is less than 5 and status 500', (done) => {
            let user = {
                name: 'kosasih',
                email: 'kosasih@mail.com',
                password: '456'
            }
            chai.request(app)
                .post('/users/register')
                .send(user)
                .end((err, result) => {
                    expect(result).to.have.status(500)
                    expect(result.body).to.have.property('info')
                    expect(result.body.info).equal('error creating user')
                    expect(result.body.data).to.have.property('message')
                    expect(result.body.data).to.have.property('errors')
                    expect(result.body.data.message).equal('User validation failed: password: The password field should be at least 5 characters')
                    done()
                })
        })

    })
})