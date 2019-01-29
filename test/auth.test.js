// const chai = require('chai');
// const expect = chai.expect;
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
// const helper = require('../helper/userHelper.js');
// const User = require('../models/user');
// const Auth = require('../middlewares/auth');
// chai.use(sinonChai)

// const fn = sinon.spy();
// const req = {
//   headers: {
//     token: ''
//   },

// }

// describe.only('Testing auth middleware', function () {

//   before(function (done) {
//     helper.create(done);
//   })

//   after(function (done) {
//     User.deleteMany({}, () => {
//       done()
//     })
//   })

//   it('should return true', (done) => {
//     const jwt = require('jsonwebtoken')
//     expect(fn).to.have.been.called;
//     done()
//   })

// })