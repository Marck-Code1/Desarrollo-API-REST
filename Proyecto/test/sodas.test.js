
const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const createApp = require("../src/app");

let app;

beforeEach(() => {
  app = createApp({ logging: false });
});

test("GET /sodas devuelve una lista de sodas", async () => {
  const res = await request(app).get("/sodas").expect(200);

  assert.ok(Array.isArray(res.body));

  for (const soda of res.body) {
    assert.equal(typeof soda.id, "number");
    assert.equal(typeof soda.nombre, "string");
    assert.ok(["normal", "de-sabor"].includes(soda.tipo));
  }
});

test("GET /sodas filtra correctamente por tipo normal", async () => {
  const res = await request(app)
    .get("/sodas")
    .query({ tipo: "normal" })
    .expect(200);

  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.every(soda => soda.tipo === "normal"));
});

test("GET /sodas filtra correctamente por tipo de-sabor", async () => {
  const res = await request(app)
    .get("/sodas")
    .query({ tipo: "de-sabor" })
    .expect(200);

  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.every(soda => soda.tipo === "de-sabor"));
});

test("GET /sodas normaliza el filtro y rechaza valores inválidos", async () => {
  const res = await request(app)
    .get("/sodas")
    .query({ tipo: " Normal " })
    .expect(200);

  assert.ok(res.body.every(soda => soda.tipo === "normal"));

  const invalid = await request(app)
    .get("/sodas")
    .query({ tipo: "otro" })
    .expect(400);

  assert.equal(invalid.body.error.code, "VALIDATION_ERROR");
});
