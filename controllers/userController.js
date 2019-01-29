const User = require('../models/user')
const bcrypt = require('bcryptjs')
const tokenGenerator = require('../helper/tokenGenerator')

module.exports = {
    createUser(req, res) {
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        User.create(newUser)
            .then(newUser => {
                res.status(201).json({info: 'user created successfully', data: newUser})
            })
            .catch(err => {
                res.status(500).json({info: 'error creating user', data: err})
            })
    },
    login(req, res) {
        User.findOne({email: req.body.email})
            .then(user => {
                if (user) {
                    if (bcrypt.compareSync(req.body.password, user.password)) {
                     
                        let token = tokenGenerator.generate({name: user.name, email: user.email})
                        res.status(200).json({
                          user: {
                            id: user._id, 
                            name: user.name, 
                            email: user.email
                          }, 
                          token: token
                        })
                    }
                    else {
                        res.status(400).json({info: 'incorrect password'})
                    }
                }
                else {
                    res.status(400).json({info: 'incorrect email'})
                }
            })
    }
}