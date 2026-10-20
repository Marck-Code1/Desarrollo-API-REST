const ApiError = require("../errors/ApiError");

function sodaNotFound() {
  return new ApiError(404, "SODA_NOT_FOUND", "Soda no encontrada.");
}

function createSodaController(repository) {
  return {
    list(req, res) {
      res.json(repository.findAll(req.validated.query.tipo));
    },

    getById(req, res) {
      const soda = repository.findById(req.validated.params.id);
      if (!soda) throw sodaNotFound();
      res.json(soda);
    },

    create(req, res) {
      const soda = repository.create(req.validated.body);
      res.location(`/sodas/${soda.id}`).status(201).json(soda);
    },

    update(req, res) {
      const soda = repository.update(req.validated.params.id, req.validated.body);
      if (!soda) throw sodaNotFound();
      res.json(soda);
    },

    delete(req, res) {
      if (!repository.delete(req.validated.params.id)) throw sodaNotFound();
      res.status(204).end();
    },
  };
}

module.exports = createSodaController;
