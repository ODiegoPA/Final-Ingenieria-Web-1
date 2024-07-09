import mysql2 from 'mysql2/promise'

const config = {
    host: 'localhost',
    port: 3306, 
    user: 'root',
    password: 'root',
    database: 'compumundo'
};

const connection = await mysql2.createConnection(config);

export class UsuarioModel {
    static async getAll(){
        const result = await connection.query('SELECT * FROM usuarios')
        const usuarios = result[0]
        return usuarios
    }
    static async getByID(id){
        const [user] = await connection.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (user.length === 0){
            return null
        }
        return user;
    }
    static async create({usuario, correo, password, admin}) {
        const [result] = await connection.execute(
            'INSERT INTO usuarios (usuario, correo, password, admin) VALUES (?, ?, ?, ?)',
            [usuario, correo, password, admin]
        );
        return result.insertId;
    }
    static async getAllByCourseID(id){
            const [result] = await connection.execute(
                'SELECT u.* FROM usuarios u JOIN estudiantes_cursos ec ON u.id = ec.usuario_id WHERE ec.curso_id = ?',
                [id]
            );
            return result;
    }
    static async getUsuarioEnCurso(usuario_id, curso_id) {
        try {
            const [result] = await connection.execute(
                'SELECT u.* FROM usuarios u JOIN estudiantes_cursos ec ON u.id = ec.usuario_id WHERE ec.curso_id = ? AND u.id = ?',
                [curso_id, usuario_id]
            );
            return result[0];
        } catch (error) {
            console.error('Error en la consulta SQL:', error.message);
            throw error;
        }
    }
    static async addToCourse({usuario_id, curso_id}){
        const [result] = await connection.execute(
         'INSERT INTO estudiantes_cursos (usuario_id, curso_id) VALUES(?,?)',
            [usuario_id, curso_id]
        );
        return result.insertId;
    }
    static async addWatchedLesson({usuario_id, leccion_id }){
        const[result] = await connection.execute(
            'INSERT INTO usuarios_lecciones (usuario_id, leccion_id) VALUES (?,?)',
            [usuario_id, leccion_id]
        );
        return result.insertId;
    }
    static async getTotalLeccionesVistas(usuarioId, cursoId) {
        try {
            const [result] = await connection.execute(
                `SELECT COUNT(*) AS total_lecciones_vistas
                 FROM usuarios_lecciones ul
                 JOIN lecciones l ON ul.leccion_id = l.id
                 WHERE ul.usuario_id = ? AND l.curso_id = ?`,
                [usuarioId, cursoId]
            );
            return result[0].total_lecciones_vistas;
        } catch (error) {
            console.error('Error al obtener el total de lecciones vistas:', error);
        }
    }
}