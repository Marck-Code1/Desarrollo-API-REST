const { test } = require("node:test");
const assert = require("node:assert/strict");
const loadEnv = require("../src/config/env");

test("usa puerto 3001 por defecto e ignora otras variables del entorno", () => {
  assert.deepEqual(loadEnv({ PATH: "ejemplo" }), { PORT: 3001 });
});

test("valida y transforma el puerto", () => {
  assert.equal(loadEnv({ PORT: "3443" }).PORT, 3443);
  for (const PORT of ["", "abc", "0", "-1", "1.5", "65536"]) {
    assert.throws(() => loadEnv({ PORT }));
  }
});

test("HTTPS requiere ambas rutas de certificados", () => {
  assert.throws(() => loadEnv({ TLS_KEY_PATH: "ssl/key.pem" }));
  assert.throws(() => loadEnv({ TLS_CERT_PATH: "ssl/cert.pem" }));
  assert.throws(() => loadEnv({ TLS_KEY_PATH: "", TLS_CERT_PATH: "" }));
  const env = loadEnv({ TLS_KEY_PATH: "ssl/key.pem", TLS_CERT_PATH: "ssl/cert.pem" });
  assert.equal(env.TLS_KEY_PATH, "ssl/key.pem");
  assert.equal(env.TLS_CERT_PATH, "ssl/cert.pem");
});
