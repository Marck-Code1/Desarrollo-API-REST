const { z } = require("zod");

const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/).transform(Number)
    .pipe(z.number().int().min(1).max(65535)).default(3001),
  TLS_KEY_PATH: z.string().trim().min(1).optional(),
  TLS_CERT_PATH: z.string().trim().min(1).optional(),
}).refine(
  (env) => Boolean(env.TLS_KEY_PATH) === Boolean(env.TLS_CERT_PATH),
  { message: "Para HTTPS debes definir TLS_KEY_PATH y TLS_CERT_PATH juntos." },
);

function loadEnv(env = process.env) {
  return envSchema.parse(env);
}

module.exports = loadEnv;
