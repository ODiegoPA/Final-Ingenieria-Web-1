const userId = localStorage.getItem('userId');
const courseId = localStorage.getItem('courseId');
const lessonId = localStorage.getItem('lessonId');

const usernameField = document.getElementById('username');
const nameLessonField = document.getElementById('name-lesson-field');
const descriptionLessonArea = document.getElementById('description-lesson-area');
const shortDescriptionArea = document.getElementById('short-description-area');
const videoLessonField = document.getElementById('video-lesson-field');
const addLessonButton = document.getElementById('add-lesson');
const verPerfil = document.getElementById('profile-button');
const deleteLessonButton  = document.getElementById('delete-lesson');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const userResponse = await fetch(`http://127.0.0.1:4000/usuarios/${userId}`);
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        console.log(userData);
        usernameField.textContent = userData[0].usuario;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    console.log(lessonId);
    if (lessonId != null) {
        console.log('hola, pasa por lessonId')
        try {
            const lessonResponse = await fetch(`http://127.0.0.1:4000/lecciones/${lessonId}`);
            if (!lessonResponse.ok) {
                throw new Error('Failed to fetch lesson data');
            }
            const lessonData = await lessonResponse.json();
            nameLessonField.value = lessonData.nombre;
            console.log(lessonData.video_enlace);
            const text = lessonData.video_enlace;
            descriptionLessonArea.value = lessonData.descripcion;
            shortDescriptionArea.value = lessonData.descripcion_breve;
            videoLessonField.value = text;
            addLessonButton.textContent = 'Guardar Cambios';
            deleteLessonButton.style.display = 'block'
        } catch (error) {
            console.error('Error fetching lesson data:', error);
        }
    }

    addLessonButton.addEventListener('click', async () => {
        if (!nameLessonField.value || !descriptionLessonArea.value || !shortDescriptionArea.value || !videoLessonField.value) {
            alert('Todos los campos son obligatorios');
            return;
        }

        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (!youtubeRegex.test(videoLessonField.value)) {
            alert('El enlace del video debe ser un enlace válido de YouTube');
            return;
        }

        const lessonData = {
            nombre: nameLessonField.value,
            descripcion: descriptionLessonArea.value,
            descripcion_breve: shortDescriptionArea.value,
            video_enlace: videoLessonField.value,
            curso_id: courseId
        };
        try {
            let response;
            if (lessonId) {
                response = await fetch(`http://127.0.0.1:4000/lecciones/${lessonId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(lessonData)
                });
            } else {
                response = await fetch('http://127.0.0.1:4000/lecciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(lessonData)
                });
            }

            if (!response.ok) {
                throw new Error('Failed to add or edit lesson');
            }

            const result = await response.json();
            console.log('Lesson added or edited successfully:', result);
            
            if(lessonId){
                localStorage.setItem('lessonId', lessonId); 
                window.location.href = '../lesson/index.html';
            } else {
                localStorage.setItem('courseId', courseId); 
                window.location.href = '../curso/index.html';
            }
        } catch (error) {
            console.error('Error adding or editing lesson:', error);
        }
    });
    deleteLessonButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://127.0.0.1:4000/lecciones/${lessonId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete lesson');
            }

            console.log('Lesson deleted successfully');
            localStorage.removeItem('lessonId'); 
            window.location.href = '../curso/index.html';
        } catch (error) {
            console.error('Error deleting lesson:', error);
        }
    });
});
verPerfil.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../profile/index.html';
});
