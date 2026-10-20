# API de sodas con Zod

Versión independiente y reorganizada de `../Servidor`, con Express 5 y CommonJS.
Conserva las seis sodas originales y el filtro por tipo; agrega CRUD y validación
con Zod 4. Los datos se guardan **en memoria** y se reinician al detener el proceso.

## Ejecutar

Requiere Node.js 22.9 o superior. Desde `Parcial2/Server_VAL`:

```powershell
npm install
npm start
```

Disponible en **http://localhost:3001**. Para reiniciar automáticamente al editar:

```powershell
npm run dev
```

Puedes copiar `.env.example` a `.env` y modificar `PORT`. Los scripts cargan `.env`
si existe; las variables ya definidas en el entorno tienen prioridad.

## Organización

```text
src/
  app.js                  Configuración de Express, sin abrir puertos
  server.js               Inicio HTTP/HTTPS
  config/env.js           Validación de configuración con Zod
  data/sodas.js           Datos iniciales
  routes/soda.routes.js    Rutas y middleware de validación
  controllers/            Solicitudes y respuestas HTTP
  schemas/                Esquemas Zod de body, params y query
  repositories/           Operaciones sobre la colección en memoria
  middleware/             Validación, Content-Type y manejo de errores
  errors/                 Error controlado de la API
test/                     Pruebas de integración y configuración
GET.http                  Ejemplos para REST Client
```

## Endpoints

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/` | Información de la API |
| GET | `/test` | Mensaje de prueba en JSON |
| GET | `/sodas` | Todas las sodas |
| GET | `/sodas?tipo=normal` | Sodas del tipo indicado |
| GET | `/sodas/:id` | Una soda por id |
| POST | `/sodas` | Crear; devuelve `201` y cabecera `Location` |
| PUT | `/sodas/:id` | Reemplazar nombre y tipo |
| PATCH | `/sodas/:id` | Actualizar uno o ambos campos |
| DELETE | `/sodas/:id` | Eliminar; devuelve `204` sin cuerpo |

Las listas son arreglos JSON; las operaciones sobre una soda devuelven un objeto:

```json
{
  "id": 1,
  "nombre": "Coca Cola",
  "tipo": "normal"
}
```

### Validaciones

- `nombre`: texto de 1 a 100 caracteres después de quitar espacios de los extremos.
- `tipo`: `normal` o `de-sabor`. Se aceptan mayúsculas y espacios en los extremos;
  se almacena y devuelve en minúsculas.
- `id`: entero positivo seguro, sin decimales, signos ni ceros iniciales. Lo genera
  el servidor y no puede enviarse en el cuerpo.
- POST y PUT requieren `nombre` y `tipo`; PATCH requiere al menos uno.
- Los cuerpos solo admiten esos campos y requieren `Content-Type: application/json`.
- El filtro solo admite `tipo`; se rechazan filtros desconocidos o repetidos.
- El cuerpo JSON tiene un límite de 16 KB.

Ejemplo en PowerShell:

```powershell
Invoke-RestMethod http://localhost:3001/sodas
Invoke-RestMethod 'http://localhost:3001/sodas?tipo=normal'
Invoke-RestMethod -Uri http://localhost:3001/sodas -Method Post -ContentType 'application/json' -Body '{"nombre":"Sprite","tipo":"de-sabor"}'
```

## Errores

Se usa el mismo formato JSON para errores; no se devuelven trazas internas.
Los mensajes de detalle de Zod pueden estar en inglés.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos de la solicitud no son válidos.",
    "details": [
      {
        "source": "params",
        "path": "id",
        "message": "El id debe ser un entero positivo."
      }
    ]
  }
}
```

| Estado | Cuándo |
| --- | --- |
| 400 | Validación fallida o JSON mal formado |
| 404 | Soda o ruta inexistente |
| 413 | Cuerpo mayor a 16 KB |
| 415 | Content-Type o codificación no soportados |
| 500 | Error interno inesperado; se registra en la consola |

## HTTPS opcional

Por defecto usa HTTP para desarrollo local. Para usar HTTPS, configura ambas rutas
en `.env` (relativas a `Server_VAL` o absolutas):

```dotenv
PORT=3443
TLS_KEY_PATH=ssl/key.pem
TLS_CERT_PATH=ssl/cert.pem
```

Debes proporcionar tus certificados; no se copian ni se publican claves privadas.
También puedes apuntar a los certificados locales de `../Servidor/ssl/`.
Al habilitar HTTPS, cambia `@baseUrl` en `GET.http` a `https://localhost:3443`.
El puerto solo atiende el protocolo elegido. Usa un certificado confiable con SAN
para localhost; no desactives la verificación TLS globalmente.

## Pruebas

```powershell
npm test
```

Usan `node:test` y Supertest con una colección independiente por prueba.

## Alcance respecto al servidor original

Esta versión se centra en la API de sodas: no incorpora las vistas Pug, `/hola` ni
la carga de archivos `/subir`, que no forman parte del recurso. No incluye
autenticación: el middleware API key del original estaba en otra instancia de
Express y no protegía su router. Esta API es pública, con CORS abierto para
desarrollo; antes de desplegarla, añade autenticación, restringe los orígenes
permitidos y utiliza almacenamiento persistente.
