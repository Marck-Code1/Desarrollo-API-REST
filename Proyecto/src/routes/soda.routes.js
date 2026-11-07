const { Router } = require("express");
const createSodaController = require("../controllers/soda.controller");
const validate = require("../middleware/validate");
const requireJson = require("../middleware/requireJson");
const {
  sodaSchema,
  actualizarSodaSchema,
  sodaParamsSchema,
  sodaQuerySchema,
} = require("../schemas/soda.schema");

function createSodaRouter(repository) {
  const router = Router();
  const controller = createSodaController(repository);
  const params = sodaParamsSchema;

  router.get("/", validate({ query: sodaQuerySchema }), controller.list);
  router.get("/:id", validate({ params }), controller.getById);
  router.post("/", requireJson, validate({ body: sodaSchema }), controller.create);
  router.put("/:id", requireJson, validate({ params, body: sodaSchema }), controller.update);
  router.patch("/:id", requireJson, validate({ params, body: actualizarSodaSchema }), controller.update);
  router.delete("/:id", validate({ params }), controller.delete);

  return router;
}

module.exports = createSodaRouter;
