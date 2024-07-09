import {UsuarioModel} from '../models/user.js'

export class UsuarioController {
    static async getAll(req, res){
        const usuarios = await UsuarioModel.getAll();
        res.send({usuarios})
    }
    static async getById(req,res) {
        const {id} = req.params;
        const usuario = await UsuarioModel.getByID(id);
        res.json(usuario);
    }
    static async create(req, res){
        const {
            usuario,
            correo,
            password,
            admin
        } = req.body;
        const nuevoUsuario = await UsuarioModel.create({
            usuario,correo,password,admin
        })
        res.status(201).json(nuevoUsuario);
    }
    static async addToCourse(req, res){
        const{
            usuario_id,
            curso_id
        } = req.body;
        const nuevaAdicion = await UsuarioModel.addToCourse({
            usuario_id, curso_id
        })
        res.status(201).json(nuevaAdicion)
    }
    static async addWatchedLesson(req, res){
        const{
            usuario_id,
            leccion_id
        } = req.body;
        const nuevaVista = await UsuarioModel.addWatchedLesson({
            usuario_id, leccion_id
        })
        res.status(201).json(nuevaVista)
    }
    static async getTotalLeccionesVistas(req, res) {
        const { usuarioId, cursoId } = req.params;
        try {
            const totalLeccionesVistas = await UsuarioModel.getTotalLeccionesVistas(usuarioId, cursoId);
            res.status(200).json({ total_lecciones_vistas: totalLeccionesVistas });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el total de lecciones vistas' });
        }
    }
    static async getAllByCourseID(req, res) {
        const { curso_id } = req.params;
        try {
            const estudiantes = await UsuarioModel.getAllByCourseID(curso_id);
            res.status(200).json(estudiantes);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los estudiantes del curso', details: error.message });
        }
    }
    static async getUsuarioEnCurso(req, res) {
        const { usuario_id, curso_id } = req.params;
        try {
            const usuario = await UsuarioModel.getUsuarioEnCurso(usuario_id, curso_id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado en el curso especificado' });
            }
            res.status(200).json(usuario);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el usuario del curso', details: error.message });
        }
    }
}