const loadInitialTemplate = () => {
    const template = `
    <div class="container p-5">
        <div class="card">
            <div class="card-body">
                <h1>Administracion de Usuarios</h1>
                <form id="user-form">
                    <div class="mb-3">
                      <label class="form-label">Nombre</label>
                      <input type="text" name="name" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Apellidos</label>
                        <input type="text" name="lastname" class="form-control">
                      </div>
                    <button type="submit" class="btn btn-primary">Enviar</button>
                  </form>
            </div>
        </div>
        <ul id="user-list" class="list-group mt-3">
        </ul>
    </div>
    `

    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const getUsers = async () => {
    const response = await fetch('/users', {
        headers: {
            Authorization : localStorage.getItem('jwt')
        }
    })
    const users = await response.json()
    const template = user => `
    <li class="list-group-item">
        <div class="row align-items-center">
            <div class="col-lg-10 col-md-10 col-sm-10 col-12">
                ${user.name} ${user.lastname}
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-12">
                <button type="button" class="btn btn-danger" data-id="${user._id}"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    </li>
    `
    const userList = document.getElementById('user-list')
    userList.innerHTML = users.map(user => template(user)).join('')
    users.forEach(user => {
        const userNode = document.querySelector(`[data-id="${user._id}"]`)
        
        userNode.onclick = (e) => {
            
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/users/${user._id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization : localStorage.getItem('jwt')
                        }
                    })
                    userNode.parentNode.parentNode.parentNode.remove()
                  Swal.fire(
                    'Deleted!',
                    'Your User has been deleted.',
                    'success'
                  )
                }
            })
            
        }
    })
}

const addFormListener = () => {
    const userForm = document.getElementById('user-form')
    userForm.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(userForm)
        const data = Object.fromEntries(formData.entries())
        await fetch('/users', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization : localStorage.getItem('jwt')
            }
        })
        userForm.reset()
        getUsers()
    }
}

const checkLogin = () =>
    localStorage.getItem('jwt')

const usersPage = () => {
    loadInitialTemplate()
    addFormListener()
    getUsers()
}

const loadRegisterTemplate = () => {
    const template = `
    <div class="container p-5">
    <div class="row justify-content-center align-items-center">
        <div class="col-lg-6 col-md-6 lg-sm-12">
            <div class="card">
                <div class="card-header">
                    <h2 class = "text-center">Register</h2>
                </div>
                <div class="card-body">
                    <form id="register-form">
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-lg-3 col-md-5 lg-sm-12">
                                    <label class="form-label">Nombres</label>
                                </div>
                                <div class="col-lg-9 col-md-7 lg-sm-12">
                                    <input type="text" name="name" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-lg-3 col-md-5 lg-sm-12">
                                    <label class="form-label">Apellidos</label>
                                </div>
                                <div class="col-lg-9 col-md-7 lg-sm-12">
                                    <input type="text" name="lastname" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-lg-3 col-md-5 lg-sm-12">
                                    <label class="form-label">Email</label>
                                </div>
                                <div class="col-lg-9 col-md-7 lg-sm-12">
                                    <input type="text" name="email" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-lg-3 col-md-5 lg-sm-12">
                                    <label class="form-label">Password</label>
                                </div>
                                <div class="col-lg-9 col-md-7 lg-sm-12">
                                    <input type="text" name="password" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12 col-md-12 lg-sm-12">
                                <div class="text-center">
                                    <button type="submit" class="btn btn-success">Registrarse</button>
                                    <div class="mt-3">
                                        <span class="form-text">¿Ya tienes Cuenta?</span>
                                        <a href="#" id="login">Iniciar Sesión</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
        
    </div>
    `

    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}
const addRegisterListener = () => {
    const registerForm = document.getElementById('register-form')
    registerForm.onsubmit =  async (e) => {
        e.preventDefault()
        const formData = new FormData(registerForm)
        const data = Object.fromEntries(formData.entries())

        const response = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            }
        })

        const responseData = await response.text()
        if (response.status >= 300) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al Registrarte',
              })
        }else{
            await Swal.fire({
                icon: 'success',
                title: 'Successful',
                text: 'Something went wrong!',
                footer: '<a href="">Why do I have this issue?</a>'
            })
            localStorage.setItem('jwt', `Bearer ${responseData}`)
            loginPage()
        }

    }
}
const gotoLoginListener = () => {
    const gotoRegister = document.getElementById('login')
    gotoRegister.onclick = (e) => {
        e.preventDefault()
        loginPage()
    }
}

const registerPage = () => {
    loadRegisterTemplate()
    addRegisterListener()
    gotoLoginListener()
}

const loginPage = () => {
    loadLoginTemplate()
    addLoginListener()
    gotoRegisterListener()
}

const gotoRegisterListener = () => {
    const gotoRegister = document.getElementById('register')
    gotoRegister.onclick = (e) => {
        e.preventDefault()
        registerPage()
    }
}

const loadLoginTemplate = () => {
    const template = `
    <div class="container p-5">
    <div class="row justify-content-center align-items-center">
        <div class="col-lg-6 col-md-6 lg-sm-12">
            <div class="card">
                <div class="card-header">
                    <h2 class = "text-center">Login</h2>
                </div>
                <div class="card-body">
                    <form id="login-form">
                        <div class="mb-3">
                        <div class="row">
                            <div class="col-lg-3 col-md-5 lg-sm-12">
                                <label class="form-label">Email</label>
                            </div>
                            <div class="col-lg-9 col-md-7 lg-sm-12">
                                <input type="text" name="email" class="form-control">
                            </div>
                        </div>
                        </div>
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-lg-3 col-md-5 lg-sm-12">
                                    <label class="form-label">Password</label>
                                </div>
                                <div class="col-lg-9 col-md-7 lg-sm-12">
                                    <input type="text" name="password" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12 col-md-12 lg-sm-12">
                                <div class="text-center">
                                    <button type="submit" class="btn btn-success">Login</button>
                                    <div class="mt-3">
                                        <span class="form-text">¿No tienes Cuenta?</span>
                                        <a href="#" id="register">Registro</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
        
    </div>
    `

    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const addLoginListener = () => {
    const loginForm = document.getElementById('login-form')
    loginForm.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(loginForm)
        const data = Object.fromEntries(formData.entries())

        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type' : 'application/json',
            }
        })

        const responseData = await response.text()
        if (response.status >= 300) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Usuario y/o contraseña inválida',
              })
        }else{
            Swal.fire({
                icon: 'success',
                title: 'Successful',
                text: 'Something went wrong!',
                footer: '<a href="">Why do I have this issue?</a>'
              })
              localStorage.setItem('jwt', `Bearer ${responseData}`)
              usersPage()
        }
    }
}



window.onload = () => {
    const isLoggedIn = checkLogin()
    if (isLoggedIn) {
        usersPage()
    } else {
        loginPage()
    }
}