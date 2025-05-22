import express from 'express';
import path from 'path';
const app = express();
const PORT = 3000;

app.use(express.static(path.join('frontend')));
app.use(express.json());
app.use(express.static('public'));


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

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
