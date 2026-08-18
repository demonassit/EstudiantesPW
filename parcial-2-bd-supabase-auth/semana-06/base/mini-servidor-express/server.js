const express = require('express');

const app = express();
app.use(express.json());

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Mini-servidor escuchando en el puerto ${PORT}`);
});
