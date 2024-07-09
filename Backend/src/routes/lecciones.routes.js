import { Router } from 'express';
import { LeccionController } from '../controllers/lecciones.controller.js';

export const leccionRouter = Router();

leccionRouter.get('/curso/:curso_id', LeccionController.getByCursoID);
leccionRouter.get('/:id', LeccionController.getByID);
leccionRouter.post('/', LeccionController.create);
leccionRouter.put('/:id', LeccionController.update);
leccionRouter.delete('/:id', LeccionController.delete);
leccionRouter.get('/usuarios/:usuario_id/lecciones/:leccion_id', LeccionController.getVisitedLesson);