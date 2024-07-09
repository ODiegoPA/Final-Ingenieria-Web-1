const userId = localStorage.getItem('userId');
const profilePic = document.getElementById('profile-pic');
const userNameField = document.getElementById('username');
const headerCourseTitle = document.getElementById('header-course-title');
const courseTitle = document.getElementById('course-title');
const courseText = document.getElementById('course-text');
const courseImage = document.getElementById('course-image');
const matricularButton = document.getElementById('matricular-button');
const lessonsList = document.querySelector('.lessons-list');
const profileButton = document.getElementById('profile-button');
const registerButton = document.getElementById('register-button');
const courseId = localStorage.getItem('courseId');
const createLesson = document.getElementById('crear-leccion');
const editCourse = document.getElementById('edit-course')

document.addEventListener('DOMContentLoaded', async () => {
    var isAdmin = false;
    var isInCourse = false;

    async function loadData() {
        try {
            if (userId) {
                const userResponse = await fetch(`http://127.0.0.1:4000/usuarios/${userId}`);
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await userResponse.json();
                const userName = userData[0].usuario;
                isAdmin = userData[0].admin === 1;
                userNameField.textContent = userName;

                
                console.log('id del curso'+courseId);

                const enrolledResponse = await fetch(`http://127.0.0.1:4000/usuarios/${userId}/cursos/${courseId}`);
                if (enrolledResponse.ok) {
                    const enrolledData = await enrolledResponse.json();
                    if (enrolledData !== null) {
                        matricularButton.style.display = 'none';
                        isInCourse = true;
                    }
                } else {
                    console.error('Failed to fetch enrolled data');
                }

                if (isAdmin) {
                    profilePic.src = '../general/media/admin.png';
                    matricularButton.style.display = 'none';
                    createLesson.style.display = 'block';
                } else {
                    profileButton.style.display = 'block';
                }
            } else {
                userNameField.style.display = 'none';
                profilePic.style.display = 'none';
                registerButton.style.display = 'block';
                profileButton.style.display = 'none';
                matricularButton.style.display = 'none';
            }

            
            console.log(courseId);
            const courseResponse = await fetch(`http://127.0.0.1:4000/cursos/${courseId}`);
            if (!courseResponse.ok) {
                throw new Error('Failed to fetch course data');
            }
            const courses = await courseResponse.json();
            const courseData = courses[0];
            const courseAdminId = courseData.admin_id;
            courseTitle.textContent = courseData.nombre;
            courseText.textContent = courseData.descripcion;
            document.title = courseData.nombre;
            const imageUrl = `http://127.0.0.1:4000/src/uploads/${courseData.imagen}`;
            courseImage.src = imageUrl
            headerCourseTitle.textContent = courseData.nombre;

            if(isAdmin && userId != courseAdminId){
                createLesson.style.display = 'none'
            } else if (isAdmin) {
                editCourse.style.display = 'block'
            }

            matricularButton.addEventListener('click', async () => {
                try {
                    const enrollResponse = await fetch(`http://127.0.0.1:4000/usuarios/agregarACurso`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            usuario_id: userId,
                            curso_id: courseId
                        })
                    });
                    if (!enrollResponse.ok) {
                        throw new Error('Failed to enroll user in course');
                    }
                    console.log('Usuario matriculado en el curso:', courseData.nombre);
                    window.location.reload();
                    matricularButton.style.display = 'none';
                } catch (error) {
                    console.error('Error enrolling user:', error);
                }
            });

            const leccionesResponse = await fetch(`http://127.0.0.1:4000/lecciones/curso/${courseId}`);
            if (!leccionesResponse.ok) {
                throw new Error('Failed to fetch lessons data');
            }
            const leccionesData = await leccionesResponse.json();
            renderLessons(leccionesData, isAdmin, userId, courseAdminId, isInCourse);
        } catch (error) {
            console.error('Error fetching or rendering data:', error);
        }
    }

    function renderLessons(lessons, isAdmin, userId, courseAdminId, isInCourse) {
        lessonsList.innerHTML = '';
        const lessonsArray = Array.isArray(lessons) ? lessons : [lessons];

        lessonsArray.forEach(lesson => {
            const lessonElement = document.createElement('div');
            lessonElement.classList.add('lesson-item');
            let buttonsHtml = '';

            if (isAdmin && userId == courseAdminId) {
                buttonsHtml = `
                    <button onclick="localStorage.setItem('lessonId', '${lesson.id}'); location.href='../lesson/index.html?leccionId=${lesson.id}'">Ver contenido de la lección</button>
                    <button onclick="localStorage.setItem('lessonId', '${lesson.id}'); location.href='../AdmEditLesson/index.html?leccionId=${lesson.id}'">Editar lección</button>
                `;
                console.log('paso por el admin')
            } else if (isAdmin || (userId && isInCourse == false)) {
                console.log('paso por el admin no registrado')
            } else if (userId) {
                buttonsHtml = `
                    <button onclick="localStorage.setItem('lessonId', '${lesson.id}'); location.href='../lesson/index.html?leccionId=${lesson.id}'">Ver contenido de la lección</button>
                `;
                console.log('paso por el user registrado')
            } else {
                buttonsHtml = `
                    <button onclick="location.href='../registerPage/index.html'">Ver contenido de la lección</button>
                `;
                console.log('paso por el no registrado ')
            }

            lessonElement.innerHTML = `
                <div class="third-lesson-text">
                    <h3>${lesson.nombre}</h3>
                    <p>${lesson.descripcion_breve}</p>
                    ${buttonsHtml}
                </div>
            `;
            lessonsList.appendChild(lessonElement);
        });
    }

    await loadData();
});

registerButton.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('courseId');
    localStorage.removeItem('lessonId');
    window.location.href = '../registerPage/index.html';
});

profileButton.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('courseId');
    localStorage.removeItem('lessonId');
    window.location.href = '../profile/index.html';
});

editCourse.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.setItem('courseId', courseId)
    window.location.href = '../AdmEditCourse/index.html';
});
createLesson.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.setItem('courseId', courseId);
    localStorage.removeItem('lessonId');
    window.location.href = '../AdmEditLesson/index.html';
});