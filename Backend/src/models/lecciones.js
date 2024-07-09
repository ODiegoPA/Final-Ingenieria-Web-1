import mysql2 from 'mysql2/promise';

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'compumundo'
};

const connection = await mysql2.createConnection(config);

export class LeccionModel {
    static async getByCursoID(curso_id) {
        const [lecciones] = await connection.execute(
            'SELECT * FROM lecciones WHERE curso_id = ?',
            [curso_id]
        );
        return lecciones;
    }
    static async getByID(id) {
        const [leccion] = await connection.execute(
            'SELECT * FROM lecciones WHERE id = ?',
            [id]
        );
        if (leccion.length === 0) {
            return null;
        }
        return leccion[0];
    }
    static async getVisitedLesson({ usuario_id, leccion_id }) {
        if (usuario_id === undefined || leccion_id === undefined) {
            throw new Error('usuario_id y leccion_id son requeridos');
        }
        const [leccion] = await connection.execute(
            'SELECT * FROM usuarios_lecciones WHERE usuario_id = ? AND leccion_id = ?',
            [usuario_id, leccion_id]
        );
        return leccion;
    }
    static async create({ nombre, descripcion, descripcion_breve, video_enlace, curso_id }) {
        const [result] = await connection.execute(
            'INSERT INTO lecciones (nombre, descripcion, descripcion_breve, video_enlace, curso_id) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, descripcion_breve, video_enlace, curso_id]
        );
        return result.insertId;
    }
    static async update(id, { nombre, descripcion, descripcion_breve, video_enlace }) {
        const [result] = await connection.execute(
            'UPDATE lecciones SET nombre = ?, descripcion = ?, descripcion_breve = ?, video_enlace = ? WHERE id = ?',
            [nombre, descripcion, descripcion_breve, video_enlace, id]
        );
        return result;
    }
    static async delete(id) {
        await connection.execute(
            'DELETE FROM usuarios_lecciones WHERE leccion_id = ?',
            [id]
        );
        const [result] = await connection.execute(
            'DELETE FROM lecciones WHERE id = ?',
            [id]
        );
        return result;
    }
}
