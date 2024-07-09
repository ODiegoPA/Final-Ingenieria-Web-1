async function fetchCourses() {
    try {
        const response = await fetch('http://127.0.0.1:4000/cursos');
        const data = await response.json();
        if (data && data.cursos) {
            renderCourses(data.cursos);
        } else {
            console.error('No courses found');
            renderCourses([]); 
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

async function fetchCoursesByName(name) {
    try {
        const response = await fetch(`http://127.0.0.1:4000/cursos/buscar/${name}`);
        const data = await response.json();
        renderCourses(data);
    } catch (error) {
        console.error('Error fetching courses by name:', error);
    }
}

async function renderCourses(courses) {
    const userId = localStorage.getItem('userId');
    const userResponse = await fetch(`http://127.0.0.1:4000/usuarios/${userId}`);
    const userData = await userResponse.json();
    var isAdmin = false;
    if (userId){
        isAdmin = userData[0].admin === 1;
    }
    if (isAdmin){}
    const container = document.getElementById('courses-container');
    container.innerHTML = '';
    
    if (courses === null) {
        container.innerHTML = '<h1>No se encontraron cursos :(</h1>';
        return;
    }

    for (const course of courses) {
        const courseElement = document.createElement('div');
        courseElement.classList.add('course-item');
        
        const leccionesResponse = await fetch(`http://127.0.0.1:4000/cursos/${course.id}/lecciones`);
        const leccionesData = await leccionesResponse.json();
        const totalLecciones = leccionesData.num_lecciones;
        console.log('Total lecciones: ' + totalLecciones);
                
        let porcentaje = 0;
        if (!isAdmin && userId !== null) {

            const leccionesVistasResponse = await fetch(`http://127.0.0.1:4000/usuarios/${userId}/cursos/${course.id}/lecciones-vistas`);
            const leccionesVistasData = await leccionesVistasResponse.json();
            const leccionesVistas = parseInt(leccionesVistasData.total_lecciones_vistas, 10);
            porcentaje = totalLecciones === 0 ? 0 : Math.floor((leccionesVistas / totalLecciones) * 100);
            console.log('Porcentaje: ' + porcentaje);
        }
    
        let isEnrolled = false;
        if (userId !== null && !isAdmin) {
            const enrollResponse = await fetch(`http://127.0.0.1:4000/usuarios/${userId}/cursos/${course.id}`);
            if (enrollResponse.ok) {
                const enrollData = await enrollResponse.json();
                isEnrolled = enrollData !== null;
            }
        }

        const imageUrl = `http://127.0.0.1:4000/src/uploads/${course.imagen_vista_previa}`;
        
        courseElement.innerHTML = `
            <div class="course-info">
                <h3>${course.nombre}</h3>
                <p>${course.descripcion_breve}</p>
                <div class="course-button">
                    <button class="info-button" data-course-id="${course.id}">
                        Más información
                    </button>
                    ${!isAdmin && userId !== null && isEnrolled ? `<progress value="${porcentaje}" max="100"></progress>` : ''}
                </div>
            </div>
            <div class="course-image">
                <a href="#" data-course-id="${course.id}">
                    <img src="${imageUrl}" alt="${course.nombre}">
                </a>
            </div>
        `;
        
        container.appendChild(courseElement);
        const anchor = courseElement.querySelector('a');
        anchor.addEventListener('click', () => redirectToCourse(course.id));
    }
    
    const infoButtons = document.querySelectorAll('.info-button');
    infoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const courseId = button.getAttribute('data-course-id');
            localStorage.setItem('courseId', courseId); 
            console.log(courseId)
            window.location.href = `../curso/index.html`;
        });
    });
}

async function loadData(){
    const userId = localStorage.getItem('userId');
    const userNameField = document.getElementById('username');
    const profilePic = document.getElementById('profile-pic');
    console.log("hola"+ userId)
    if (userId) {
        try{
            const userResponse = await fetch(`http://127.0.0.1:4000/usuarios/${userId}`);
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await userResponse.json();
            const userName = userData[0].usuario;
            userNameField.textContent = userName;
            console.log(userData[0].admin)
            if (userData[0].admin === 1){
                console.log('hola');
                profilePic.src = '../general/media/admin.png';
            }
        } catch (error) {
            console.error('Error fetching or rendering courses:', error);
        }
    } else {
        const profileButton = document.getElementById('profile-button');
        const registerButton = document.getElementById('register');
        userNameField.style.display = 'none';
        profilePic.style.display = 'none';
        profileButton.style.display = 'none';
        registerButton.style.display = 'block';
    }
}
function redirectToCourse(courseId) {
    localStorage.setItem('courseId', courseId);
    window.location.href = '../curso/index.html'; 
}

document.addEventListener('DOMContentLoaded', fetchCourses);
document.addEventListener('DOMContentLoaded', loadData);

const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const searchTerm = searchBar.value.trim();
        if (searchTerm !== '') {
            await fetchCoursesByName(searchTerm);
        } else {
            fetchCourses(); 
        }
    }
});

const verPerfil = document.getElementById('profile-button');
verPerfil.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('courseId');
    localStorage.removeItem('lessonId');
    window.location.href = '../profile/index.html';
});

const registrarse = document.getElementById('register');
registrarse.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('courseId');
    localStorage.removeItem('lessonId');
    window.location.href = '../registerPage/index.html';
});

const crearCurso = document.getElementById('create-course-button');
crearCurso.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('courseId');
    localStorage.removeItem('lessonId');
    window.location.href = '../AdmEditCourse/index.html';
});
