const { z } = require("zod");

const tipoSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.enum(["normal", "de-sabor"]));

const sodaSchema = z.strictObject({
  nombre: z.string().trim().min(1).max(100),
  tipo: tipoSchema,
});

const actualizarSodaSchema = sodaSchema.partial().refine(
  (datos) => Object.keys(datos).length > 0,
  { message: "Debes enviar al menos nombre o tipo." },
);

const sodaParamsSchema = z.strictObject({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, "El id debe ser un entero positivo.")
    .transform(Number)
    .pipe(z.number().int().positive()),
});

const sodaQuerySchema = z.strictObject({
  tipo: tipoSchema.optional(),
});

module.exports = {
  sodaSchema,
  actualizarSodaSchema,
  sodaParamsSchema,
  sodaQuerySchema,
};
