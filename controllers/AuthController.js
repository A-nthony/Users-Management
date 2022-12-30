const Users = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

const Auth = {
    register: async (req, res) => {

        const { body } = req
        try {
            const isUser = await Users.findOne({ email: body.email})
            if (isUser) {
                return res.status(403).send('Usuario ya existe')
            }
            const salt = await bcrypt.genSalt()
            const hashed = await bcrypt.hash(body.password, salt)
            const user = Users.create({name: body.name, lastname: body.lastname, email: body.email, password: hashed, salt})
            res.status(201).send(user._id)
        } catch (err) {
            console.log(err)
            res.status(500).send(err.message)
        }
        
    }
}

module.exports = Auth