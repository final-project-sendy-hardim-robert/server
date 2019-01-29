const User = require('../models/user')
const jwt = require('jsonwebtoken')

class Auth {
  static isLogin(req, res, next) {
      try {
          const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
          User
              .findOne({
                  email : decoded.email
              })
              .then(user => {
                  if(user) {
                      req.currentUser = user
                      next()
                  } else {
                      res.status(400).json({
                        info: 'user not found'
                      })
                  }
              })
              .catch(err => {
                  res.status(500).json({
                      error: 'internal server error'
                  })
              })
      } catch(e) {
          if(e.message == 'jwt must be provided') {
              console.log('here')
              res.status(400).json({
                  errors: {
                      token: {
                          message: 'Please provide your access token'
                      }
                  }
              })
          } else {
              res.status(400).json({
                  errors: {
                      token: {
                          message: 'Invalid access token'
                      }
                  }
              })
          }
      }
  }
}

module.exports = Auth