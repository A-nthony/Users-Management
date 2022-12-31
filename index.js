require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)

const User = mongoose.model('User', {
    username: String,
    edad: Number,
})

const crear = async () => {
    const user = new User({ username: 'Anthony', edad: 23})
    const savedUser = await user.save()
    console.log(savedUser)
}

//crear()

const buscarTodo = async () => {
    const users = await User.find()
    console.log(users)
}
//buscarTodo()

const buscar = async () => {
    const user = await User.find({ username : 'Anthony'})
    console.log(user)
}
//buscar()

const buscarUno = async () => {
    const user = await User.findOne({ username : 'Anthony'})
    console.log(user)
}
//buscarUno()

const actualizar = async () => {
    const user = await User.findOne({ username : 'Anthony'})
    user.edad = 30
    await user.save()
    console.log(user)
}
//actualizar()

const eliminar = async () => {
    const user = await User.findOne({ username : 'Anthony'})
    if (user) {
        await user.remove()
    }
    
}
//eliminar()