import {Router} from 'express'
import { UsuarioController } from '../controllers/usuario.controller.js'
export const userRouter = Router();

userRouter.get('/', (req, res) => {
    UsuarioController.getAll(req, res)
})
userRouter.get('/:id',UsuarioController.getById);
userRouter.post('/',UsuarioController.create);
userRouter.get('/:usuarioId/cursos/:cursoId/lecciones-vistas', UsuarioController.getTotalLeccionesVistas)
userRouter.post('/agregarACurso', UsuarioController.addToCourse);
userRouter.post('/agregarLeccionVista', UsuarioController.addWatchedLesson);
userRouter.get('/cursos/:curso_id/estudiantes', UsuarioController.getAllByCourseID);
userRouter.get('/:usuario_id/cursos/:curso_id', UsuarioController.getUsuarioEnCurso);