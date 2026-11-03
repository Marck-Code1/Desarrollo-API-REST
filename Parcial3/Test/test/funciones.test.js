import assert from "node:assert"
import test from "node:test"
import * as funciones from "../src/funciones.js"

test("Debe de regresar un saludo con nombre", () => {
    const name = funciones.hola("Manuel");
    assert.match(name, /Hola, Manuel!!!/);
})
