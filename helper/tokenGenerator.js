const jwt = require('jsonwebtoken')

module.exports = {
    generate(user) {
        return jwt.sign(user, process.env.JWT_SECRET)
    }
}