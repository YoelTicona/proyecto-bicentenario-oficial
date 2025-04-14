const app = require('./app');
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`BACKEND: Servidor corriendo en puerto - ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});