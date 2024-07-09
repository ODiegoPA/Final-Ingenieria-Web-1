import express, { json } from 'express';
import { userRouter } from './routes/usuario.routes.js';
import { cursoRouter } from './routes/course.routes.js';
import { leccionRouter } from './routes/lecciones.routes.js';
import cors from 'cors'; 
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors());
app.use(json());

app.use('/usuarios', userRouter);
app.use('/cursos', cursoRouter);
app.use('/lecciones', leccionRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

app.use('/src/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        res.status(400).json("No file uploaded.");
        return;
    }
    
    console.log('File uploaded:', req.file);
    
    res.status(200).json(req.file.filename);
});
app.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'src/uploads', filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
