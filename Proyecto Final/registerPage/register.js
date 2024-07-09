document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('register-button');

    registerButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const admin = false;

        if (!username || !email || !password) {
            alert('Todos los campos son obligatorios');
            return;
        }

        if (email.length < 5) {
            alert('correo electronico invalido');
            return;
        }

        try {
            const usersResponse = await fetch('http://127.0.0.1:4000/usuarios');
            const usersData = await usersResponse.json();
            const users = usersData.usuarios;

            if (users.some(user => user.correo === email)) {
                alert('Este correo ya está registrado');
                return;
            }

            const response = await fetch('http://127.0.0.1:4000/usuarios/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: username,
                    correo: email,
                    password: password,
                    admin: admin
                }),
            });

            if (!response.ok) {
                throw new Error('Error al registrar usuario');
            }

            alert('Usuario registrado exitosamente');

            const newUserResponse = await fetch('http://127.0.0.1:4000/usuarios');
            const newUserData = await newUserResponse.json();
            const newUser = newUserData.usuarios.find(user => user.correo === email && user.password === password);

            if (newUser) {
                localStorage.setItem('userId', newUser.id);
                window.location.href = "../profile/index.html";
            } else {
                console.error('No se encontró el usuario recién registrado');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar usuario. Credencial Invalida.');
        }
    });
});
