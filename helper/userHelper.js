const User = require('../models/user.js');

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
    console.log('kuda terbang')
    User.create({
      name: 'robert test',
      email: 'test@gmail.com',
      password: '123456'
    })
      .then((data) => {
        console.log(data, 'hai sini')
        done()
      })
      .catch((err) => {
        console.log(err,'hai kuda')
        done()
      })
  }
}
