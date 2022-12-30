const express = require('express')
const user = require('./controllers/UserController')
const app = express()
const port = 3000

app.use(express.json())

app.get('/users', user.list)
app.post('/users', user.create)
app.get('/users/:id', user.get )
app.put('/users/:id', user.update)
app.patch('/users/:id', user.update)
app.delete('/users/:id', user.destroy)

app.get('*', (req, res) => {
    res.status(404).send('Esta pagina no existe')
})

app.listen(port, ()=> {
    console.log('Arrancando la aplicación 🎉')
})