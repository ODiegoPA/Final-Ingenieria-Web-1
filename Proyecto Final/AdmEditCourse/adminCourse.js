const userId = localStorage.getItem('userId');
const courseId = localStorage.getItem('courseId');

const usernameField = document.getElementById('username');
const nameCourseField = document.getElementById('name-course-field');
const descriptionCourseArea = document.getElementById('description-course-area');
const shortDescriptionArea = document.getElementById('short-description-area');
const imageCourseFile = document.getElementById('image-course-file');
const imageCourseFilePreview = document.getElementById('image-course-file-preview');
const addCourseButton = document.getElementById('add-course-button');
const deleteCourseButton = document.getElementById('delete-course-button');
const verPerfil = document.getElementById('profile-button');

document.addEventListener('DOMContentLoaded', async () => {
    
    let currentImagePath = '';
    let currentImagePreviewPath = '';

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
    if (courseId) {
        try {
            const courseResponse = await fetch(`http://127.0.0.1:4000/cursos/${courseId}`);
            if (!courseResponse.ok) {
                throw new Error('Failed to fetch course data');
            }
            const data = await courseResponse.json();
            const courseData = data[0];
            nameCourseField.value = courseData.nombre || '';
            descriptionCourseArea.value = courseData.descripcion || '';
            shortDescriptionArea.value = courseData.descripcion_breve || '';

            currentImagePath = courseData.imagen || ''; 
            currentImagePreviewPath = courseData.imagen_vista_previa || '';
            deleteCourseButton.style.display = 'block';
            addCourseButton.textContent = 'Guardar Cambios'
        } catch (error) {
            console.error('Error fetching course data:', error);
        }
    }

    addCourseButton.addEventListener('click', async () => {
        let imagePath = currentImagePath;
        let previewImagePath = currentImagePreviewPath;

        if (!nameCourseField.value || !descriptionCourseArea.value || !shortDescriptionArea.value) {
            alert('Todos los campos son obligatorios');
            return;
        }

        if (imageCourseFile.files.length > 0) {
            const imageFile = imageCourseFile.files[0];
            imagePath = await uploadImage(imageFile);
        } else if (!courseId){
            imagePath = 'fondo.jpg';
        }

        if (imageCourseFilePreview.files.length > 0) {
            const imageFilePreview = imageCourseFilePreview.files[0];
            previewImagePath = await uploadImage(imageFilePreview);
        } else if (!courseId){
            previewImagePath = 'fondo.jpg';
        }

        const courseData = {
            id: courseId,
            nombre: nameCourseField.value,
            descripcion: descriptionCourseArea.value,
            descripcion_breve: shortDescriptionArea.value,
            imagen: imagePath,
            imagen_vista_previa: previewImagePath,
            admin_id: userId
        };

        try {
            let response;
            if (courseId) {
                response = await fetch(`http://127.0.0.1:4000/cursos/${courseId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(courseData)
                });
            } else {
                response = await fetch('http://127.0.0.1:4000/cursos/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(courseData)
                });
                
            }

            if (!response.ok) {
                console.log('paso por error editar o añadir curso');
                throw new Error('Failed to add or edit course');
            }

            const result = await response.json();
            console.log('Course added or edited successfully:', result);
            if (!response.ok) {
                console.log('paso por error editar o añadir curso');
                throw new Error('Failed to add or edit course');
            }
            if(courseId){
                localStorage.setItem('courseId', courseId); 
                window.location.href = '../curso/index.html';
            } else {
                window.location.href = '../profile/index.html';
            }
        } catch (error) {
            console.error('Error adding or editing course:', error);
        }
    });
    deleteCourseButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://127.0.0.1:4000/cursos/${courseId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete course');
            }

            console.log('Course deleted successfully');
            localStorage.removeItem('courseId'); 
            window.location.href = '../courseList/index.html';
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    });

    async function uploadImage(imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch('http://127.0.0.1:4000/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const result = await response.json();
            console.log('Lo de abajo es importante ' + result);
            return result; 
        } catch (error) {
            console.error('Error uploading image:', error);
            return '';
        }
    }
});
verPerfil.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../profile/index.html';
});

