document.getElementById('login-button').addEventListener('click', async () => {
    const correo = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('http://127.0.0.1:4000/usuarios');
        const data = await response.json();
        const users = data.usuarios;

        const user = users.find(user => user.correo === correo && user.password === password);

        if (user) {
            localStorage.setItem('userId', user.id);
            window.location.href = "../profile/index.html";
        } else {
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
});


