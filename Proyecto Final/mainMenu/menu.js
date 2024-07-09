document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('header-login-button');
    const registerButton = document.getElementById('header-register-button');
    const seeCourses = document.getElementById('see-courses-button');
    const menurRegister = document.getElementById('register-button');
    localStorage.removeItem('userId');
    localStorage.removeItem('courseId');
    localStorage.removeItem('lessonId');
    loginButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;


        if (email && password) {
            try {
                const response = await fetch('http://127.0.0.1:4000/usuarios');
                const data = await response.json();
                const users = data.usuarios;
                console.log("Datos recibidos de la API:", data);
                
                const user = users.find(user => user.correo === email && user.password === password);
                console.log("coso"+user)
                if (user) {
                    localStorage.setItem('userId', user.id);
                    window.location.href = "../profile/index.html"; 
                } else {
                    console.log("Usuario no encontrado o contraseña incorrecta.");
                    window.location.href = '../loginPage/index.html';
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                window.location.href = '../loginPage/index.html';
                
            }
        } else {
           console.log("Correo o contraseña no proporcionados.");
            window.location.href = '../loginPage/index.html';
        }
    });
    registerButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '../registerPage/index.html';
    });
    menurRegister.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '../registerPage/index.html';
    });
    seeCourses.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('userId');
        window.location.href = '../courseList/index.html';
    });
});
