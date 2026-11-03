const path = require("node:path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const {
  getJsAsset,
  renderApiReference,
} = require("@scalar/server-side-rendering");
const createSodaRepository = require("./repositories/soda.repository");
const createSodaRouter = require("./routes/soda.routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

let scalarJsAsset;
function getScalarJsAsset() {
  scalarJsAsset ??= getJsAsset();
  return scalarJsAsset;
}

function createApp({
  repository = createSodaRepository(),
  logging = true,
} = {}) {
  const app = express();

  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API de Sodas/Refrescos",
        version: "1.0.0",
        description: "Documentación de mis endpoints",
      },
      servers: [{ url: "/", description: "Servidor actual" }],
      tags: [{ name: "Sodas", description: "Operaciones sobre sodas/refrescos" }],
      components: {
        schemas: {
          Soda: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              nombre: { type: "string", example: "Coca Cola" },
              tipo: { type: "string", enum: ["normal", "de-sabor"], example: "normal" },
            },
          },
          SodaInput: {
            type: "object",
            required: ["nombre", "tipo"],
            additionalProperties: false,
            properties: {
              nombre: { type: "string", minLength: 1, maxLength: 100, example: "Coca Cola" },
              tipo: { type: "string", enum: ["normal", "de-sabor"], example: "normal" },
            },
          },
          SodaUpdate: {
            type: "object",
            minProperties: 1,
            additionalProperties: false,
            properties: {
              nombre: { type: "string", minLength: 1, maxLength: 100, example: "Pepsi" },
              tipo: { type: "string", enum: ["normal", "de-sabor"], example: "de-sabor" },
            },
          },
          Error: {
            type: "object",
            properties: {
              error: {
                type: "object",
                properties: {
                  code: { type: "string", example: "SODA_NOT_FOUND" },
                  message: { type: "string", example: "Soda no encontrada." },
                },
              },
            },
          },
        },
      },
    },
    // Rutas absolutas para que Swagger encuentre los archivos sin importar
    // desde qué directorio se ejecute el servidor.
    apis: [path.join(__dirname, "routes/*.js"), path.join(__dirname, "app.js")],
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  // Scalar se renderiza en el servidor y se hidrata con un bundle local:
  // no se descarga nada desde CDN ni desde servicios externos.
  let docsPage;
  const getDocsPage = () => {
    docsPage ??= renderApiReference({
      pageTitle: "API de Sodas/Refrescos",
      cdn: "/docs/scalar.js",
      config: {
        content: swaggerSpec,
        withDefaultFonts: false,
        // Oculta las funciones de la plataforma Scalar (Ask AI, Deploy, Share,
        // generar SDK, cliente de API y telemetría) para dejar solo la documentación.
        showDeveloperTools: "never",
        hideClientButton: true,
        agent: { disabled: true },
        mcp: { disabled: true },
        telemetry: false,
      },
    }).catch((err) => {
      // Permite reintentar en la siguiente petición si el render falló.
      docsPage = undefined;
      throw err;
    });
    return docsPage;
  };

  app.get("/docs/scalar.js", (req, res) => {
    res.type("application/javascript").send(getScalarJsAsset());
  });

  app.get("/docs", async (req, res, next) => {
    try {
      res.type("text/html").send(await getDocsPage());
    } catch (err) {
      next(err);
    }
  });

  app.disable("x-powered-by");
  app.use(cors());
  if (logging) app.use(morgan("dev"));
  app.use(express.json({ limit: "16kb" }));

  app.get("/", (req, res) => {
    res.json({ nombre: "API de sodas", version: "1.0.0", recurso: "/sodas" });
  });
/**
 * @openapi
 * /test:
 *   get:
 *     summary: Retorna un hola mundo!
 *     responses:
 *       200:
 *         description: Mensaje devuelto con éxito.
 */
  app.get("/test", (req, res) => {
    res.json({ message: "Hola Mundo!" });
  });

/**
 * @openapi
 * /sodas:
 *   get:
 *     tags: [Sodas]
 *     summary: Lista todas las sodas
 *     parameters:
 *       - in: query
 *         name: tipo
 *         required: false
 *         schema:
 *           type: string
 *           enum: [normal, de-sabor]
 *         description: Filtra las sodas por tipo.
 *     responses:
 *       200:
 *         description: Lista de sodas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Soda'
 *       400:
 *         description: Parámetros de consulta inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Sodas]
 *     summary: Crea una soda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SodaInput'
 *     responses:
 *       201:
 *         description: Soda creada.
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: URL de la soda creada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soda'
 *       400:
 *         description: Cuerpo inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       415:
 *         description: El Content-Type debe ser application/json.
 */

/**
 * @openapi
 * /sodas/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *       description: Id de la soda.
 *   get:
 *     tags: [Sodas]
 *     summary: Obtiene una soda por id
 *     responses:
 *       200:
 *         description: Soda encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soda'
 *       400:
 *         description: Id inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Soda no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Sodas]
 *     summary: Reemplaza una soda por id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SodaInput'
 *     responses:
 *       200:
 *         description: Soda actualizada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soda'
 *       400:
 *         description: Datos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Soda no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     tags: [Sodas]
 *     summary: Actualiza parcialmente una soda por id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SodaUpdate'
 *     responses:
 *       200:
 *         description: Soda actualizada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soda'
 *       400:
 *         description: Datos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Soda no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Sodas]
 *     summary: Elimina una soda por id
 *     responses:
 *       204:
 *         description: Soda eliminada.
 *       400:
 *         description: Id inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Soda no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

  app.use("/sodas", createSodaRouter(repository));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
