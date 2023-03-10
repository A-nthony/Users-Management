const express = require('express')
const bcrypt = require('bcrypt')
const { expressjwt: jwt } = require('express-jwt')
const JWT = require('jsonwebtoken')
const User = require('../models/User')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const validateJWT = jwt({ secret: process.env.SECRET, algorithms: ['HS256']})

const signToken = (user, _id ) => JWT.sign({user, _id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
})

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

const sendMail = async (email, message) => {
    const msg = {
        to: `${email}`, // Change to your recipient
        from: process.env.FROM_SENDGRID, // Change to your verified sender
        subject: `${message}`,
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    await sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}

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
            const userS = {
                user: user.name,
                lastname: user.lastname,
                email: user.email
            }
            const signed = signToken(userS, user._id)
            res.status(201).send(signed)
            sendMail(body.email, 'Registro con exito')
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
                res.status(403).send('Usuario y/o contrase??a inv??lida')
            } else {
                const isMatch = await bcrypt.compare(body.password, user.password)
                if (isMatch) {
                    const userS = {
                        user: user.name,
                        lastname: user.lastname,
                        email: user.email
                    }
                    const signed = signToken(userS, user._id)
                    res.status(200).send(signed)
                } else {
                    res.status(403).send('Usuario y/o contrase??a inv??lida')
                }
            }
        } catch (err) {
            console.log(err)
            res.status(500).send(err.message)
        }
    },
    logout: async (req, res) => {
        try {
            res.status(200).send("logout")
        } catch (err) {
            console.log(err)
            res.status(500).send(err.message)
        }
    }

}


module.exports = { isAuthenticated, Auth}