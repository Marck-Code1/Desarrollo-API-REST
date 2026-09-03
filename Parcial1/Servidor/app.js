const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || "3000";

const sodasRouter = require("./routes/sodaRouter");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

/*    Agregar AUTENTICACION al servidor con express basic-auth  */

/*
const verificarJson = (req,res,next) => {
  if(req.headers['content-type'] !== 'application/json'){
    res.status(400).send('El server solo acepta JSON')
  } else {
    next();
  }
}
*/

app.use("/", /*verificarJson,*/ sodasRouter);

app.use(function (req, res, next) {
  res.status(404).send("Recurso no encontrado");
});

app.use(function (err, req, res, next) {
  res.status(500).send("Error de servidor");
});

app.listen(PORT, () => {
  console.log("App escuchando en el puerto 3000!");
});
