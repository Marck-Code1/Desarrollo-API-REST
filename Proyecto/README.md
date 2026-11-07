# API REST de sodas

API REST desarrollada con **Express 5** y **Zod 4** para consultar y administrar una colección de sodas.

## Instalación y ejecución

Requisitos: **Node.js 22.9 o superior**.

```bash
npm install
npm run dev
```

La API estará disponible en `http://localhost:3001`.

Para ejecutar las pruebas:

```bash
npm run test
```

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/` | Información de la API |
| GET | `/test` | Comprobar el funcionamiento |
| GET | `/sodas` | Obtener todas las sodas |
| GET | `/sodas?tipo=normal` | Filtrar sodas por tipo |
| GET | `/sodas/:id` | Obtener una soda por ID |
| POST | `/sodas` | Registrar una soda |
| PUT | `/sodas/:id` | Reemplazar una soda |
| PATCH | `/sodas/:id` | Actualizar una soda |
| DELETE | `/sodas/:id` | Eliminar una soda |

### Tipos disponibles

- `normal`
- `de-sabor`

### Ejemplo de respuesta

```json
{
  "id": 1,
  "nombre": "Coca Cola",
  "tipo": "normal"
}
```

Para registrar o actualizar una soda, se debe enviar un cuerpo JSON con los campos `nombre` y `tipo`. El identificador es asignado automáticamente por la API.

## HTTPS

Actualmente, el proyecto utiliza **HTTP por defecto**. No se incluyen certificados SSL/TLS en el repositorio público, por lo que HTTPS no está configurado inicialmente.

Si se desea habilitar HTTPS de manera local, se pueden proporcionar certificados propios mediante las siguientes variables de entorno:

```env
PORT=3443
TLS_KEY_PATH=ssl/key.pem
TLS_CERT_PATH=ssl/cert.pem
```

Las rutas pueden ser relativas a la carpeta `Proyecto` o absolutas. Los certificados y las claves privadas deben obtenerse y configurarse por separado; no forman parte del repositorio.

## Consideraciones

- Los datos se almacenan en memoria. Al detener el servidor, los cambios realizados se pierden.
- La API no cuenta con autenticación.
- CORS está habilitado para facilitar el desarrollo.
- Para un entorno de producción se recomienda implementar autenticación, restringir los orígenes permitidos y utilizar almacenamiento persistente.
