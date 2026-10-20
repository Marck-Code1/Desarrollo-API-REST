const ApiError = require("../errors/ApiError");

function requireJson(req, res, next) {
  if (!req.is("application/json")) {
    return next(new ApiError(
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      "Envía el cuerpo con Content-Type: application/json.",
    ));
  }

  next();
}

module.exports = requireJson;
