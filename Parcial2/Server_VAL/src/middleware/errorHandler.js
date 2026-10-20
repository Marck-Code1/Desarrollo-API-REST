const ApiError = require("../errors/ApiError");

function notFound(req, res, next) {
  next(new ApiError(404, "ROUTE_NOT_FOUND", "Ruta no encontrada."));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: { code: "INVALID_JSON", message: "El cuerpo no es un JSON válido." },
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: { code: "PAYLOAD_TOO_LARGE", message: "El cuerpo supera el límite de 16 KB." },
    });
  }

  if (err.type === "charset.unsupported" || err.type === "encoding.unsupported") {
    return res.status(415).json({
      error: { code: "UNSUPPORTED_ENCODING", message: "La codificación del cuerpo no está soportada." },
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message },
    });
  }

  console.error(err);
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Error interno del servidor." },
  });
}

module.exports = { notFound, errorHandler };
