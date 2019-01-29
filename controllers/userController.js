const User = require('../models/user')
const bcrypt = require('bcryptjs')
const tokenGenerator = require('../helper/tokenGenerator')

module.exports = {
    getUsers(req, res) {
        User.find({})
            .then(users => {
                res.status(200).json({info: 'users found successfully', data: users})
            })
            .catch(err => {
                
                res.status(500).json({info: 'error finding users', data: err})
            })
    },
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
    updateUser(req, res) {
        User.findById(req.params.userId)
            .then(user => {
                let salt = bcrypt.genSaltSync(10)
                let password = bcrypt.hashSync(req.body.password, salt)

                let updateUser = {
                    name: req.body.name || user.name,
                    email: req.body.email || user.email,
                    password: password || user.password
                }

                return User.findOneAndUpdate({_id: user._id}, updateUser, {new: true})
            })
            .then(updatedUser => {
                res.status(201).json({info: 'user data updated successfully', data: updatedUser})
            })
            .catch(err => {
                res.status(400).json({info: 'error updating user data', data: err})
            })
    },
    deleteUser(req, res) {
        User.deleteOne({_id: req.params.userId})
            .then(result => {
                res.status(200).json({info: 'user deleted successfully', data: result})
            })
            .catch(err => {
                res.status(400).json({info: 'error deleting user', data: err})
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
            .catch(err => {
                res.status(500).json({info: 'error login', data: err})
            })
    }
}