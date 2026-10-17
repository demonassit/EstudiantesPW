// server.js — backend de práctica de la actividad autónoma (semana 9).
// Mismas rutas y controladores que backend-proyecto; solo la carpeta models/ guarda los datos en memoria,
// así que arranca sin MySQL, sin Supabase y sin .env. No lo modifiques: tu trabajo de esta semana es el front.
const express = require('express');
const cors = require('cors');

const talleresRoutes = require('./routes/talleres.routes');
const asistenciasRoutes = require('./routes/asistencias.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar que el servidor está vivo
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Registro de Asistencia - CECyT 9 funcionando correctamente (datos en memoria)' });
});

app.use(talleresRoutes);
app.use(asistenciasRoutes);
app.use(usuariosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT} (BD: memoria; los datos vuelven al inicio al reiniciar)`);
});
