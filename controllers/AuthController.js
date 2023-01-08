const express = require('express')
const bcrypt = require('bcrypt')
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const validateJWT = expressJwt({ secret: process.env.SECRET, algorithms: ['HS256']})

const signToken = _id => jwt.sign({ _id }, process.env.SECRET)

const findAndAssignUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(401).end()
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

const isAuthenticated = express.Router().use(validateJWT, findAndAssignUser)

const Auth = {
    register: async (req, res) => {
        const { body } = req
        try {
            const isUser = await User.findOne({ email: body.email})
            if (isUser) {
                return res.status(403).send('Usuario ya existe')
            }
            const salt = await bcrypt.genSalt()
            const hashed = await bcrypt.hash(body.password, salt)
            const user = User.create({name: body.name, lastname: body.lastname, email: body.email, password: hashed, salt})
            const signed = signToken(user._id)
            res.status(201).send(signed)
        } catch (err) {
            console.log(err)
            res.status(500).send(err.message)
        }   
    },

    login: async (req, res) => {
        const { body } = req
        try {
            const user = await User.findOne({ email: body.email})
            if (!user) {
                res.status(403).send('Usuario y/o contraseña inválida')
            } else {
                const isMatch = await bcrypt.compare(body.password, user.password)
                if (isMatch) {
                    const signed = signToken(user._id)
                    res.status(200).send(signed)
                } else {
                    res.status(403).send('Usuario y/o contraseña inválida')
                }
            }
        } catch (err) {
            console.log(err)
            res.status(500).send(err.message)
        }
    }

}


module.exports = { isAuthenticated, Auth}