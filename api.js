const express = require('express')
const user = require('./controllers/UserController')
const {Auth, isAuthenticated} = require('./controllers/AuthController')
const app = express()
const port = 3000

app.use(express.json())

app.get('/users', user.list)
app.post('/users', user.create)
app.get('/users/:id', user.get )
app.put('/users/:id', user.update)
app.patch('/users/:id', user.update)
app.delete('/users/:id', user.destroy)

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/html/index.html`)
})

app.post('/register', Auth.register)
app.post('/login', Auth.login)

app.get('*', (req, res) => {
    res.status(404).send('Esta pagina no existe')
})

app.listen(port, ()=> {
    console.log('Arrancando la aplicación 🎉')
})