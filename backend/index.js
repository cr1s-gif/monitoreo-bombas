import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la web
app.get('/', (req, res) => {
  res.sendFile(path.resolve('frontend', 'inicio.html'));
});

app.get('/historial', (req, res) => {
  res.sendFile(path.resolve('frontend', 'historial.html'));
});

app.get('/temperatura', (req, res) => {
  res.sendFile(path.resolve('frontend', 'temperatura.html'));
});

app.get('/vibracion', (req, res) => {
  res.sendFile(path.resolve('frontend', 'vibracion.html'));
});

// NUEVO: Recibir datos de vibración desde el ESP32
let ultimaVibracion = null;

app.post('/api/vibracion', (req, res) => {
  const { vibracion } = req.body;
  ultimaVibracion = {
    vibracion,
    timestamp: new Date().toISOString()
  };
  console.log("Vibración detectada:", ultimaVibracion);
  res.sendStatus(200);
});

// NUEVO: Endpoint para consultar último dato
app.get('/api/estado-vibracion', (req, res) => {
  res.json(ultimaVibracion || { vibracion: false, timestamp: null });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
