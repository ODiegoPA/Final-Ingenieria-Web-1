import { CursoModel } from "../models/course.js";

export class CursoController {
    static async getAll(req, res) {
        const cursos = await CursoModel.getAll();
        res.send({ cursos });
    }

    static async getById(req, res) {
        const { id } = req.params;
        const course = await CursoModel.getByID(id);
        res.json(course);
    }
    static async getByName(req, res) {
        const {nombre} = req.params;
        const course = await CursoModel.getByName(nombre);
        res.json(course)
    }

    static async create(req, res) {
        const {
            nombre,
            descripcion,
            descripcion_breve,
            imagen,
            imagen_vista_previa,
            admin_id
        } = req.body;
        const nuevoCurso = await CursoModel.create({
            nombre, descripcion, descripcion_breve, imagen, imagen_vista_previa, admin_id
        });
        res.status(201).json(nuevoCurso);
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await CursoModel.update({ id, data });
            res.json({ message: 'Curso actualizado correctamente', result });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el curso', details: error.message });
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        const result = await CursoModel.delete({ id });
        res.json({ message: 'Curso eliminado' });
    }

    static async getByUserID(req, res) {
        const { usuario_id } = req.params;
        try {
            if (!usuario_id) {
                throw new Error('usuario_id es requerido');
            }
            const cursos = await CursoModel.getByUserID(usuario_id);
            res.status(200).json(cursos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los cursos del usuario', details: error.message });
        }
    }
    static async getLessonCountByCourseId(req, res) {
        const { curso_id } = req.params;
        try {
            const num_lecciones = await CursoModel.getLessonCountByCourseId(curso_id);
            res.status(200).json({ num_lecciones });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el número de lecciones del curso', details: error.message });
        }
    }
    static async getByAdminID(req, res){
        const {admin_id} = req.params;
        try{
            if (!admin_id) {
                throw new Error('admin_id es requerido');
            }
            const cursos = await CursoModel.getByAdminId(admin_id);
            res.status(200).json(cursos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los cursos del admin', details: error.message });
        }
    }
}
