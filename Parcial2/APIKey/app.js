
const express = require("express");
const cors = require("cors");
const apiKeyAuth = require('@vpriem/express-api-key-auth').apiKeyAuth
require('dotenv').config()
const app = express()

const PORT = process.env.PORT || "3000";

const apiKey = process.env.API_KEY
console.log(apiKey)
app.use(apiKeyAuth([apiKey]));

app.get("/test", (req, res) => {
  console.log(req.query);
  res.send("Hola Mundo!");
});

app.listen(PORT, () => {
  console.log("App escuchando en el puerto 3000!");
});