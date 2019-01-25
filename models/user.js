const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name: {
        type: String,
        required: 'name is required',
        minlength: [5, 'The name field should be at least 5 characters'],
        maxlength: [20, 'The name field cannot be more than 20 characters']
    },
    email: {
        type: String,
        required: 'Email is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        validate: {
            isAsync: true,
            validator: function(email) {
                return new Promise (function(resolve, reject) {
                    User.findOne({email})
                        .then(user => {
                            if (user) reject(false)
                            else resolve(true)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
            }, message: 'Email already exist'
        }
    },
    password: {
        type: String,
        required: 'password is required',
        minlength: [5, 'The password field should be at least 5 characters']
    }
})

userSchema.pre('save', function(next) {
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User