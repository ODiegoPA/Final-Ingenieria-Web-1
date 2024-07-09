import { Router } from 'express';
import { CursoController } from '../controllers/course.controller.js';
export const cursoRouter = Router();

cursoRouter.get('/', (req, res) => {
    CursoController.getAll(req, res);
});
cursoRouter.get('/:id', CursoController.getById);
cursoRouter.post('/', CursoController.create);
cursoRouter.put('/:id', CursoController.update);
cursoRouter.delete('/:id', CursoController.delete);

cursoRouter.get('/admin/:admin_id/cursos', CursoController.getByAdminID);
cursoRouter.get('/usuario/:usuario_id/cursos', CursoController.getByUserID);
cursoRouter.get('/buscar/:nombre', CursoController.getByName);
cursoRouter.get('/:curso_id/lecciones', CursoController.getLessonCountByCourseId);

