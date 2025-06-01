import express from 'express';
import path from 'path';
const app = express();
const PORT = 3000;

app.use(express.static(path.join('frontend')));
app.use(express.json());
app.use(express.static('public'));


let temperaturaActual = null;

app.post('/temperatura', (req, res) => {
  const { temperatura } = req.body;
  console.log("Temperatura recibidaaa: ");
  temperaturaActual = temperatura;
  res.sendStatus(200);
});

app.get('/temperatura', (req, res) => {
  res.json({ temperatura: temperaturaActual });
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('frontend', 'inicio.html'));
});

app.get('/historial', (req, res) => {
  res.sendFile(path.resolve('frontend', 'historial.html'));
});

app.get('/temperatura', (req, res) => {
  res.sendFile(path.resolve( 'frontend', 'temperatura.html'));
});

app.get('/vibracion', async(req, res) => {
  res.sendFile(path.resolve('frontend', 'vibracion.html'));
});

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

app.get('/api/estado-vibracion', (req, res) => {
  res.json(ultimaVibracion || { vibracion: false, timestamp: null });
});

app.listen(3000, '0.0.0.0', () => {
  console.log("Servidor escuchandooooo en puerto 3000");
});
