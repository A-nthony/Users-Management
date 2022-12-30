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
    const response = await fetch('/users')
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
                        method: 'DELETE'
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
                'Content-Type': 'application/json'
            }
        })
        userForm.reset()
        getUsers()
    }
}

window.onload = () => {
    loadInitialTemplate()
    addFormListener()
    getUsers()
}