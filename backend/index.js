import express from 'express';
import path from 'path';
const app = express();
const PORT = 3000;
import pkg from 'pg';
const { Pool } = pkg;

const pool= new Pool({
  connectionString: 'postgresql://Historial_owner:npg_zmi7Fvn6yasV@ep-frosty-snowflake-a8xovjxz-pooler.eastus2.azure.neon.tech/Historial?sslmode=require', 
  ssl:{
    rejectUnauthorized: false
  }
  });
  pool.connect()
  .then(() => {
    console.log("Conexión exitosa a la base de datos Neon");
  })
  .catch((err) => {
    console.error(" Error al conectar con la base de datos:", err);
  });
  export default pool;

app.use(express.static(path.join('frontend')));
app.use(express.json());
app.use(express.static('public'));


let temperaturaActual = null;
let lecturas = [];

app.post('/temperatura', async (req, res) => {
  const { temperatura } = req.body;
  const temp = parseFloat(temperatura);
  console.log("Temperatura recibidaaaa");

  temperaturaActual = temp;
  lecturas.push(temp);
  res.sendStatus(200);
});
setInterval(async () => {
  if (lecturas.length === 0) return;
  const suma = lecturas.reduce((a, b) => a + b, 0);
  const promedio = suma / lecturas.length;
 try {
    await pool.query('INSERT INTO temperatura(valor) VALUES($1)', [promedio]);
    console.log("promedio listo");
  } catch (error) {
    console.error('Error al guardar el promedio:', error);
  }
  lecturas = [];
}, 60_000);
 
app.get('/historial-temperatura', async (req, res) => {
  try {
    const result = await pool.query(`SELECT valor, TO_CHAR(fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Santiago', 'DD-MM-YYYY HH24:MI:SS') AS fecha FROM temperatura ORDER BY fecha DESC`); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).send('Error al obtener historial');
  }
});


app.get('/api/temperatura', (req, res) => {
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
