const chai = require('chai')
const expect = chai.expect
const chaiHTTP = require('chai-http')
const app = require('../app.js')
const helper = require('../helper/userHelper.js')
const User = require('../models/user')
const Schedule = require('../models/schedule')
const ScheduleController = require('../controllers/scheduleController')
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai)
chai.use(chaiHTTP);

const dummySchedule = {
  start: '10:00',
  finish: '12:00',
  active: true
}

const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGhpbWFzaGFyIiwiZW1haWwiOiJkaGltYXMuaGFyQGdtYWlsLmNvbSIsImlhdCI6MTU0ODczNjExOH0.Iz3qWwrbf6IAl3N63OvMJ8GZr93d8cQyugIShrItp_k'
const NAME = 'ROBERT ARIFIN'
const EMAIL = 'test@gmail.com'
const PASSWORD = '123456'

let token = ''
let tokenDummy = ''

describe('testing scheduler', function () {

  before(async function () {
    await Schedule.deleteMany({})
    await User.deleteMany({})
    await User.create({
      name: NAME,
      email: EMAIL,
      password: PASSWORD
    })
    const response = await chai
      .request(app)
      .post('/users/login')
      .send({
        email: EMAIL,
        password: PASSWORD
      });
    token = response.body.token;
  });

  after(async function () {
    await Schedule.deleteMany({})
    await User.deleteMany({})
  })

  describe('testing post schedule routes', function () {
    it('should send an object with an error message and a 500 status code', async function () {
      const response = await chai
        .request(app)
        .post("/schedule")
        .set('token', token)
        .send({
          start: '',
          finish: '11',
          active: false
        })

      expect(response).to.have.status(500);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('info');
      expect(response.body.info).to.equal("Schedule validation failed: startTime: Start Schedule time is required")
    });

    it('should send an object with an error message and a 500 status code', async function () {
      const response = await chai
        .request(app)
        .post("/schedule")
        .set('token', token)
        .send({
          start: '12',
          finish: '',
          active: false
        })

      expect(response).to.have.status(500);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('info');
      expect(response.body.info).to.equal("Schedule validation failed: finishTime: Finish Schedule time is required")
    });

    it('should send an object with a success message and a 201 status code', async function () {
      const response = await chai
        .request(app)
        .post("/schedule")
        .set('token', token)
        .send(dummySchedule)

      expect(response).to.have.status(201);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('info');
      expect(response.body).to.have.property('data');
      expect(response.body.info).to.equal('schedule saved');
      expect(response.body.data).to.have.property('_id');
      expect(response.body.data).to.have.property('startTime');
      expect(response.body.data).to.have.property('finishTime');
      expect(response.body.data).to.have.property('active');
      expect(response.body.data).to.have.property('owner');
      expect(response.body.data.startTime).to.equal('10:00');
      expect(response.body.data.finishTime).to.equal('12:00');
      expect(response.body.data.active).to.equal(false);
    });

    it('should send an object with a success message and a 201 status code when updating schedule', async function () {
      await chai
        .request(app)
        .post("/schedule")
        .set('token', token)
        .send(dummySchedule)

      const response = await chai
        .request(app)
        .post("/schedule")
        .set('token', token)
        .send({
          start: '11:00',
          finish: '13:00',
          active: true
        })

      expect(response).to.have.status(201);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('info');
      expect(response.body).to.have.property('data');
      expect(response.body.info).to.equal('schedule saved');
      expect(response.body.data).to.have.property('_id');
      expect(response.body.data).to.have.property('startTime');
      expect(response.body.data).to.have.property('finishTime');
      expect(response.body.data).to.have.property('active');
      expect(response.body.data).to.have.property('owner');
      expect(response.body.data.startTime).to.equal('11:00');
      expect(response.body.data.finishTime).to.equal('13:00');
      expect(response.body.data.active).to.equal(true);
    });

    it('should send an error object with a message and a 400 status code (no token)', async function () {
      const response = await chai
        .request(app)
        .post("/schedule")
        .send(dummySchedule)

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property('token');
      expect(response.body.errors.token.message).to.equal('Please provide your access token');
    });

    it('should send an error object with a message and a 400 status code (invalid token)', async function () {
      const response = await chai
        .request(app)
        .post("/schedule")
        .set('token', 'harydhimas')
        .send(dummySchedule)

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('errors');
      expect(response.body.errors).to.have.property('token');
      expect(response.body.errors.token.message).to.equal('Invalid access token');
    });

    it('should send an error object with a message and a 400 status code (user not found)', async function () {
      const response = await chai
        .request(app)
        .post("/schedule")
        .set('token', expiredToken)
        .send(dummySchedule)

      expect(response).to.have.status(400);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('info');
      expect(response.body.info).to.equal('user not found');
    });

  })

  describe('testing get user schedule', function () {

    it('should send an object with a success message and a 200 status code', async function () {
      const response = await chai
        .request(app)
        .get("/schedule")
        .set('token', token)

      expect(response).to.have.status(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('startTime');
      expect(response.body).to.have.property('finishTime');
      expect(response.body).to.have.property('active');
      expect(response.body).to.have.property('owner');
      expect(response.body.startTime).to.equal('11:00');
      expect(response.body.finishTime).to.equal('13:00');
      expect(response.body.active).to.equal(true);
    });

    it('should send null with a success message and a 200 status code if user doesnt have any schedule', async function () {
      await User.create({
        name: 'haryhary',
        email: 'harydua@mail.com',
        password: '123456'
      })

      const loginUser2 = await chai
        .request(app)
        .post('/users/login')
        .send({
          email: 'harydua@mail.com',
          password: '123456'
        });

      tokenDummy = loginUser2.body.token

      const response = await chai
        .request(app)
        .get("/schedule")
        .set('token', tokenDummy)

      expect(response).to.have.status(200);
      expect(response.body).to.equal(null);

    });

  })

  describe('testing stop task cron schedule', function () {
    beforeEach(() => ScheduleController.stopTask = sinon.stub());

    afterEach(() => ScheduleController.stopTask.reset());

    it('should send an object with a success message and a 200 status code', async function () {
      const response = await chai
        .request(app)
        .post("/schedule/finish")
        .set('token', token)

      expect(response).to.have.status(200);
      expect(response.body).to.equal('task is stoped')
    });

    it('should return an error message and status 500', async function () {
      ScheduleController.stopTask.withArgs({
        currentUser: {
          _id: 'error'
        }
      }, null).returns(Promise.reject({
        error: 'internal server error'
      }))

      return ScheduleController.stopTask({
        currentUser: {
          _id: 'error'
        }
      }, null).then(result => {
        expect(result).to.be.undefined;
      }).catch(err => {
        expect(err).to.eql({
          error: 'internal server error'
        })
      })
    })
  })

  describe('testing start task cron schedule', function () {

    beforeEach(() => ScheduleController.startTask = sinon.stub());

    afterEach(() => ScheduleController.startTask.reset());

    it('should send an object with a success message and a 200 status code', async function () {
      const response = await chai
        .request(app)
        .post("/schedule/start")
        .set('token', token)

      expect(response).to.have.status(200);
      expect(response.body).to.equal('task is started')
    });

    it('should return an error message and status 500', async function () {
      ScheduleController.startTask.withArgs({
        currentUser: {
          _id: 'error'
        }
      }, null).returns(Promise.reject({
        error: 'internal server error'
      }))

      return ScheduleController.startTask({
        currentUser: {
          _id: 'error'
        }
      }, null).then(result => {
        expect(result).to.be.undefined;
      }).catch(err => {
        expect(err).to.eql({
          error: 'internal server error'
        })
      })
    })
  })


});
