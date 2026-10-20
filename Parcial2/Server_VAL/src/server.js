const http = require("node:http");
const https = require("node:https");
const fs = require("node:fs");
const path = require("node:path");
const createApp = require("./app");
const loadEnv = require("./config/env");

try {
  const config = loadEnv();
  const app = createApp();
  const useHttps = Boolean(config.TLS_KEY_PATH);
  const root = path.resolve(__dirname, "..");
  const server = useHttps
    ? https.createServer({
      key: fs.readFileSync(path.resolve(root, config.TLS_KEY_PATH)),
      cert: fs.readFileSync(path.resolve(root, config.TLS_CERT_PATH)),
    }, app)
    : http.createServer(app);

  server.on("error", (err) => {
    console.error("No se pudo iniciar el servidor:", err.message);
    process.exitCode = 1;
  });

  server.listen(config.PORT, () => {
    console.log(`API de sodas en ${useHttps ? "https" : "http"}://localhost:${config.PORT}`);
  });
} catch (err) {
  console.error("Configuración inválida o certificados no disponibles:", err.message);
  process.exitCode = 1;
}
