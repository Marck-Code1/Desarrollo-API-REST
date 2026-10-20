const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createSodaRepository = require("./repositories/soda.repository");
const createSodaRouter = require("./routes/soda.routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

function createApp({ repository = createSodaRepository(), logging = true } = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors());
  if (logging) app.use(morgan("dev"));
  app.use(express.json({ limit: "16kb" }));

  app.get("/", (req, res) => {
    res.json({ nombre: "API de sodas", version: "1.0.0", recurso: "/sodas" });
  });
  app.get("/test", (req, res) => {
    res.json({ message: "Hola Mundo!" });
  });
  app.use("/sodas", createSodaRouter(repository));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
