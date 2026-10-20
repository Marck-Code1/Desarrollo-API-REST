function validate(schemas) {
  return (req, res, next) => {
    // Express 5 expone req.query mediante un getter: no se debe sobrescribir.
    req.validated = {};

    for (const [source, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[source]);

      if (!result.success) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Los datos de la solicitud no son válidos.",
            details: result.error.issues.map((issue) => ({
              source,
              path: issue.path.join("."),
              message: issue.message,
            })),
          },
        });
      }

      req.validated[source] = result.data;
    }

    next();
  };
}

module.exports = validate;
