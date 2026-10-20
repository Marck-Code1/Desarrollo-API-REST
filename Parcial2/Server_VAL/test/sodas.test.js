const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const createApp = require("../src/app");

let app;
beforeEach(() => {
  app = createApp({ logging: false });
});

test("lista las seis sodas originales", async () => {
  const res = await request(app).get("/sodas").expect(200);
  assert.equal(res.body.length, 6);
  assert.deepEqual(res.body[0], { id: 1, nombre: "Coca Cola", tipo: "normal" });
});

test("normaliza el filtro por tipo", async () => {
  const res = await request(app).get("/sodas").query({ tipo: " Normal " }).expect(200);
  assert.equal(res.body.length, 2);
  assert.ok(res.body.every((soda) => soda.tipo === "normal"));
  const sabor = await request(app).get("/sodas?tipo=de-sabor").expect(200);
  assert.equal(sabor.body.length, 4);
});

test("rechaza filtros inválidos, desconocidos o repetidos", async () => {
  for (const query of ["tipo=otro", "tipo=", "otro=normal", "tipo=normal&tipo=de-sabor"]) {
    const res = await request(app).get(`/sodas?${query}`).expect(400);
    assert.equal(res.body.error.code, "VALIDATION_ERROR");
    assert.equal(res.body.error.details[0].source, "query");
  }
});

test("consulta una soda por id", async () => {
  const res = await request(app).get("/sodas/2").expect(200);
  assert.equal(res.body.nombre, "Pepsi");
});

test("rechaza ids no válidos", async () => {
  for (const id of ["abc", "0", "-1", "1.5", "01", "1e0", "9007199254740992"]) {
    const res = await request(app).get(`/sodas/${id}`).expect(400);
    assert.equal(res.body.error.details[0].source, "params");
  }
});

test("crea una soda y normaliza sus campos", async () => {
  const res = await request(app).post("/sodas")
    .send({ nombre: " Sprite ", tipo: " De-Sabor " }).expect(201);
  assert.equal(res.headers.location, "/sodas/7");
  assert.deepEqual(res.body, { id: 7, nombre: "Sprite", tipo: "de-sabor" });
  const saved = await request(app).get(res.headers.location).expect(200);
  assert.deepEqual(saved.body, res.body);
});

test("rechaza cuerpos inválidos sin alterar la colección", async () => {
  const invalidBodies = [
    {}, { nombre: "Sprite" }, { tipo: "normal" },
    { nombre: " ", tipo: "normal" }, { nombre: "a".repeat(101), tipo: "normal" },
    { nombre: 123, tipo: "normal" }, { nombre: "Sprite", tipo: "otro" },
    { nombre: "Sprite", tipo: "normal", id: 50 },
    { nombre: "Sprite", tipo: "normal", precio: 10 },
    [], null,
  ];
  for (const body of invalidBodies) {
    await request(app).post("/sodas").set("Content-Type", "application/json")
      .send(JSON.stringify(body)).expect(400);
  }
  const res = await request(app).get("/sodas").expect(200);
  assert.equal(res.body.length, 6);
});

test("PUT exige ambos campos y reemplaza los valores", async () => {
  await request(app).put("/sodas/1").send({ nombre: "Nueva" }).expect(400);
  const res = await request(app).put("/sodas/1")
    .send({ nombre: "Cola Zero", tipo: "normal" }).expect(200);
  assert.deepEqual(res.body, { id: 1, nombre: "Cola Zero", tipo: "normal" });
});

test("PATCH actualiza un campo y rechaza objetos vacíos o campos extra", async () => {
  const res = await request(app).patch("/sodas/1").send({ nombre: "Cola" }).expect(200);
  assert.deepEqual(res.body, { id: 1, nombre: "Cola", tipo: "normal" });
  await request(app).patch("/sodas/1").send({}).expect(400);
  await request(app).patch("/sodas/1").send({ precio: 20 }).expect(400);
  await request(app).patch("/sodas/1").send({ tipo: "otro" }).expect(400);
});

test("elimina una soda y no reutiliza ids", async () => {
  const created = await request(app).post("/sodas")
    .send({ nombre: "Sprite", tipo: "de-sabor" }).expect(201);
  const deleted = await request(app).delete(`/sodas/${created.body.id}`).expect(204);
  assert.equal(deleted.text, "");
  await request(app).get(`/sodas/${created.body.id}`).expect(404);
  const next = await request(app).post("/sodas")
    .send({ nombre: "Otra", tipo: "normal" }).expect(201);
  assert.equal(next.body.id, created.body.id + 1);
});

test("las operaciones sobre sodas inexistentes devuelven 404", async () => {
  const responses = [
    await request(app).get("/sodas/999").expect(404),
    await request(app).put("/sodas/999").send({ nombre: "Otra", tipo: "normal" }).expect(404),
    await request(app).patch("/sodas/999").send({ nombre: "Otra" }).expect(404),
    await request(app).delete("/sodas/999").expect(404),
  ];
  for (const res of responses) assert.equal(res.body.error.code, "SODA_NOT_FOUND");
});

test("las rutas desconocidas devuelven 404, no 401", async () => {
  const res = await request(app).get("/no-existe").expect(404);
  assert.equal(res.body.error.code, "ROUTE_NOT_FOUND");
});

test("exige Content-Type JSON en POST, PUT y PATCH", async () => {
  for (const [method, url] of [["post", "/sodas"], ["put", "/sodas/1"], ["patch", "/sodas/1"]]) {
    const res = await request(app)[method](url).type("text").send("texto").expect(415);
    assert.equal(res.body.error.code, "UNSUPPORTED_MEDIA_TYPE");
  }
});

test("maneja JSON mal formado", async () => {
  const res = await request(app).post("/sodas").type("json").send('{"nombre":').expect(400);
  assert.equal(res.body.error.code, "INVALID_JSON");
});

test("limita el tamaño del cuerpo", async () => {
  const res = await request(app).post("/sodas")
    .send({ nombre: "a".repeat(17000), tipo: "normal" }).expect(413);
  assert.equal(res.body.error.code, "PAYLOAD_TOO_LARGE");
});

test("no comparte mutaciones entre instancias de la aplicación", async () => {
  await request(app).delete("/sodas/1").expect(204);
  const otherApp = createApp({ logging: false });
  await request(otherApp).get("/sodas/1").expect(200);
});
