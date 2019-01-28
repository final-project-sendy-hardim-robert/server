const User = require('../models/user.js');
const Schedule = require('../models/schedule');

module.exports =  {
  delete(done) {
    User.deleteOne({
      email: 'test123@gmail.com'
    })
      .then((data) => {
        done();
      })
      .catch((err) => {
        done()
      })
  },

  create(done) {
    User.create({
      name: 'robert test',
      email: 'test@gmail.com',
      password: '123456'
    })
      .then((data) => {
        done()
      })
      .catch((err) => {
        done()
      })
  },

  getSchedule(id) {
    return Schedule.findOne({
      owner: id
    })
  }
}
