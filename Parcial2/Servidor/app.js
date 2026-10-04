const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const app = express();
import { apiKeyAuth } from '@vpriem/express-api-key-auth';

express().use(apiKeyAuth(/^API_KEY_/));
//const basicAuth = require('express-basic-auth')
const PORT = process.env.PORT || "3000";

const sodasRouter = require("./routes/sodaRouter");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
/*app.use(basicAuth({
    users: { 'marco': '123' }
}))
*/
app.set('view engine','pug')
app.set('views', path.join(__dirname, 'views'));
 /*  Agregar log de errores y funcion manejadora de errores dentro de middleware   */
 /* Tambien debe de haber documentacion sobre el manejo de errores y el uso de la API */
app.use("/", sodasRouter);

app.get('/hola', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hola usuario' });
});




app.use(function (req, res, next) {
  res.status(401).send("Acceso denegado");
});

app.use(function (req, res, next) {
  res.status(404).send("Recurso no encontrado");
});

app.use(function (err, req, res, next) {
  res.status(500).send("Error de servidor");
});

app.listen(PORT, () => {
  console.log("App escuchando en el puerto 3000!");
});

