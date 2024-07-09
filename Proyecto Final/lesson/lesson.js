const userId = localStorage.getItem('userId');
const courseId = localStorage.getItem('courseId');
const lessonId = localStorage.getItem('lessonId');
const profilePic = document.getElementById('profile-pic');
const usernameField = document.getElementById('username');
const headeTitle = document.getElementById('header-lesson-title');
const backButton = document.getElementById('back-course');
const editCourseButton = document.getElementById('edit-lesson');
const profileButton = document.getElementById('profile-button');
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const viewedLessonResponse = await fetch(`http://127.0.0.1:4000/lecciones/usuarios/${userId}/lecciones/${lessonId}`);
        let hasViewedLesson = false;

        if (viewedLessonResponse.ok) {
            const viewedLessonData = await viewedLessonResponse.json();
            hasViewedLesson = Object.keys(viewedLessonData).length !== 0;
        }

        if (!hasViewedLesson) {
            const addViewedLessonResponse = await fetch(`http://127.0.0.1:4000/usuarios/agregarLeccionVista`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario_id: userId,
                    leccion_id: lessonId,
                }),
            });

            if (!addViewedLessonResponse.ok) {
                throw new Error('Failed to add viewed lesson');
            }
            console.log('no la vio');
        } else {
            console.log('si la vio');
        }

        const userResponse = await fetch(`http://127.0.0.1:4000/usuarios/${userId}`);
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        const userName = userData[0].usuario;
        isAdmin = userData[0].admin === 1;
        usernameField.textContent = userName;
        if (isAdmin) {
            profilePic.src = '../general/media/admin.png';
            editCourseButton.style.display = 'block'
        }
        
        const lessonResponse = await fetch(`http://127.0.0.1:4000/lecciones/${lessonId}`);
        if (!lessonResponse.ok) {
            throw new Error('Failed to fetch lesson data');
        }
        const lessonData = await lessonResponse.json();
        const lessonTitle = document.getElementById('lesson-title');
        const lessonText = document.getElementById('lesson-text');
        const videoIframe = document.querySelector('iframe');

        lessonTitle.textContent = lessonData.nombre;
        lessonText.textContent = lessonData.descripcion;
        headeTitle.textContent = lessonData.nombre;
        document.title = lessonData.nombre;

        const videoLink = lessonData.video_enlace;
        const videoId = extractYouTubeVideoId(videoLink);
        if (videoId) {
            videoIframe.src = `https://www.youtube.com/embed/${videoId}`;
        } else {
            videoIframe.style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
backButton.addEventListener('click', () => {
    localStorage.removeItem('lessonId');
    window.location.href = '../curso/index.html'; 
});

profileButton.addEventListener('click', () => {
    localStorage.removeItem('courseId');
    localStorage.removeItem('lessonId');
    window.location.href = '../profile/index.html';
});
editCourseButton.addEventListener('click', () => {
    localStorage.setItem('lessonId', lessonId);
    localStorage.setItem('courseId', courseId);
    window.location.href = '../AdmEditLesson/index.html';
});
function extractYouTubeVideoId(url) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}
