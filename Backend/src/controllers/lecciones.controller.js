import { LeccionModel } from '../models/lecciones.js';

export class LeccionController {
    static async getByCursoID(req, res) {
        const { curso_id } = req.params;
        try {
            const lecciones = await LeccionModel.getByCursoID(curso_id);
            res.status(200).json(lecciones);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener las lecciones del curso', details: error.message });
        }
    }
    static async getByID(req, res) {
        const { id } = req.params;
        try {
            const leccion = await LeccionModel.getByID(id);
            if (!leccion) {
                return res.status(404).json({ error: 'Lección no encontrada' });
            }
            res.status(200).json(leccion);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la lección', details: error.message });
        }
    }
    static async getVisitedLesson(req, res) {
        const { usuario_id, leccion_id } = req.params;
        console.log('usuario_id:', usuario_id, 'leccion_id:', leccion_id);  // Añadir log para depurar
        try {
            if (usuario_id === undefined || leccion_id === undefined) {
                return res.status(400).json({ error: 'usuario_id y leccion_id son requeridos' });
            }
            const lecciones = await LeccionModel.getVisitedLesson({ usuario_id, leccion_id });
            res.status(200).json(lecciones);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener las lecciones visitadas', details: error.message });
        }
    }
    static async create(req, res) {
        const { nombre, descripcion, descripcion_breve, video_enlace, curso_id } = req.body;
        try {
            const newLeccionId = await LeccionModel.create({ nombre, descripcion, descripcion_breve, video_enlace, curso_id });
            res.status(201).json({ message: 'Lección creada', leccionId: newLeccionId });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la lección', details: error.message });
        }
    }
    static async update(req, res) {
        const { id } = req.params;
        const { nombre, descripcion, descripcion_breve, video_enlace } = req.body;
        try {
            const result = await LeccionModel.update(id, { nombre, descripcion, descripcion_breve, video_enlace });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Lección no encontrada' });
            }
            res.status(200).json({ message: 'Lección actualizada correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la lección', details: error.message });
        }
    }
    static async delete(req, res) {
        const { id } = req.params;
        try {
            const result = await LeccionModel.delete(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Lección no encontrada' });
            }
            res.status(200).json({ message: 'Lección eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la lección', details: error.message });
        }
    }
}
