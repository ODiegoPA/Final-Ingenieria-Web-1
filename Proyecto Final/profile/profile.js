document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    localStorage.removeItem('courseId');
    localStorage.removeItem('lessonId');
    if (userId) {
        try {
            const userResponse = await fetch(`http://127.0.0.1:4000/usuarios/${userId}`);
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await userResponse.json();
            const userName = userData[0].usuario;
            const isAdmin = userData[0].admin === 1;
            const userNameElement = document.getElementById('user-name');
            userNameElement.textContent = userName;

            let cursosUrl = `http://127.0.0.1:4000/cursos/usuario/${userId}/cursos`;
            if (isAdmin) {
                cursosUrl = `http://127.0.0.1:4000/cursos/admin/${userId}/cursos`;
                const pfp = document.getElementById('pfp-image');
                pfp.src = '../general/media/admin.png';
                crearCurso.style.display = 'block'
            }

            const response = await fetch(cursosUrl);
            const cursos = await response.json();

            const courseContainer = document.querySelector('.course-container');
            courseContainer.innerHTML = '';

            for (const curso of cursos) {
                const leccionesResponse = await fetch(`http://127.0.0.1:4000/cursos/${curso.id}/lecciones`);
                const leccionesData = await leccionesResponse.json();
                const totalLecciones = leccionesData.num_lecciones;

                let porcentaje = 0;
                if (!isAdmin) {
                    const leccionesVistasResponse = await fetch(`http://127.0.0.1:4000/usuarios/${userId}/cursos/${curso.id}/lecciones-vistas`);
                    const leccionesVistasData = await leccionesVistasResponse.json();
                    const leccionesVistas = parseInt(leccionesVistasData.total_lecciones_vistas, 10);
                    porcentaje = totalLecciones === 0 ? 0 : Math.floor((leccionesVistas / totalLecciones) * 100);
                }

                const courseElement = document.createElement('div');
                courseElement.classList.add('course-item');
                const imageUrl = `http://127.0.0.1:4000/src/uploads/${curso.imagen_vista_previa}`;
                courseElement.innerHTML = `
                    <a href="#" data-course-id="${curso.id}">
                        <img src="${imageUrl}" alt="${curso.nombre}">
                    </a>
                    <h3>${curso.nombre}</h3>
                    ${!isAdmin ? `<progress value="${porcentaje}" max="100"></progress>` : ''}
                `;
                courseContainer.appendChild(courseElement);

                const anchor = courseElement.querySelector('a');
                anchor.addEventListener('click', () => redirectToCourse(curso.id));
            }

            function redirectToCourse(courseId) {
                localStorage.setItem('courseId', courseId);
                window.location.href = '../curso/index.html'; 
            }

        } catch (error) {
            console.error('Error fetching or rendering courses:', error);
        }
    } else {
        console.error('User ID not found in local storage.');
    }
});
const verCursos = document.getElementById('see-courses-button');
verCursos.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../courseList/index.html';
});
const cerrarSesion = document.getElementById('end-session-button');
cerrarSesion.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../mainMenu/index.html';
});
const crearCurso = document.getElementById('create-course-button');
crearCurso.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('courseId')
    window.location.href = '../AdmEditCourse/index.html';
});
