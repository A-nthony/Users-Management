require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)

const Users = mongoose.model('User', {
    name: { type: String, require: true, minLength: 3},
    lastname: { type: String, require: true, minLength: 3},
    email: { type: String, require: true},
    password: { type: String, require: true},
    salt: { type: String, require: true},
})

module.exports = Users