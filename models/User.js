const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:MY34tgPVXVgO1SBk@cluster0.83qm3.mongodb.net/carritocompras?retryWrites=true&w=majority')

const Users = mongoose.model('User', {
    name: { type: String, require: true, minLength: 3},
    lastname: { type: String, require: true, minLength: 3},
})

module.exports = Users