import mysql2 from 'mysql2/promise';

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'compumundo'
};

let connection;

async function connectDB() {
    if (!connection) {
        connection = await mysql2.createConnection(config);
    }
    return connection;
}

export class CursoModel {
    static async getAll() {
        const connection = await connectDB();
        const result = await connection.query('SELECT * from cursos');
        const cursos = result[0];
        return cursos;
    }

    static async getByID(id) {
        const connection = await connectDB();
        const [course] = await connection.execute('SELECT * FROM cursos WHERE id = ?', [id]);
        if (course.length === 0) {
            return null;
        }
        return course;
    }
    static async getByName(name) {
        const connection = await connectDB();
        const [course] = await connection.execute('SELECT * FROM cursos WHERE nombre LIKE ?', [`%${name}%`]);
        if (course.length === 0) {
            return null;
        }
        return course;
    }

    static async create({ nombre, descripcion, descripcion_breve, imagen, imagen_vista_previa, admin_id }) {
        const connection = await connectDB();
        const [result] = await connection.execute(
            'INSERT INTO cursos (nombre, descripcion, descripcion_breve, imagen, imagen_vista_previa, admin_id) VALUES (?,?,?,?,?,?)',
            [nombre, descripcion, descripcion_breve, imagen, imagen_vista_previa, admin_id]
        );
        return result.insertId;
    }

    static async update({ id, data }) {
        const connection = await connectDB();
        const {
            nombre,
            descripcion,
            descripcion_breve,
            imagen,
            imagen_vista_previa
        } = data;
        const result = await connection.query(
            'UPDATE cursos SET nombre = ?, descripcion = ?, descripcion_breve = ?, imagen = ?, imagen_vista_previa = ? WHERE id = ?',
            [nombre, descripcion, descripcion_breve, imagen, imagen_vista_previa, id]
        );
        return result;
    }

    static async delete({ id }) {
        const connection = await connectDB();
        await connection.query('DELETE FROM usuarios_lecciones WHERE leccion_id IN (SELECT id FROM lecciones WHERE curso_id = ?)', [id]);
        await connection.query('DELETE FROM lecciones WHERE curso_id = ?', [id]);
        await connection.query('DELETE FROM estudiantes_cursos WHERE curso_id = ?', [id]);
        const result = await connection.query('DELETE FROM cursos WHERE id = ?', [id]);
        return result;
    }

    static async getByUserID(usuario_id) {
        const connection = await connectDB();
        const [cursos] = await connection.execute(
            `SELECT c.*
             FROM cursos c
             JOIN estudiantes_cursos ec ON c.id = ec.curso_id
             WHERE ec.usuario_id = ?`,
            [usuario_id]
        );
        return cursos;
    }
    static async getLessonCountByCourseId(curso_id) {
        const connection = await connectDB();
        const [result] = await connection.execute(
            `SELECT COUNT(*) AS num_lecciones FROM lecciones WHERE curso_id = ?`,
            [curso_id]
        );
        return result[0].num_lecciones;
    }
    static async getByAdminId(admin_id){
        const connection = await connectDB();
        const [cursos] = await connection.execute(
            `SELECT * FROM cursos WHERE admin_id = ?`,
            [admin_id]
        );
        return cursos;
    }
    
}
