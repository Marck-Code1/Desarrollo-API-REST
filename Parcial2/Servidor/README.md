# Servidor HTTPS

## Iniciar

Desde `Parcial2/Servidor`:

```powershell
npm install
npm run hola
```

El servidor usa `ssl/key.pem` (clave privada) y `ssl/cert.pem` (certificado)
y escucha en **https://localhost:3000**. Ambos archivos deben existir antes
de iniciar. La clave privada está excluida de Git; no la compartas ni la publiques.

Para cambiar el puerto en PowerShell:

```powershell
$env:PORT = "3443"
npm run hola
```

Solo se aceptan conexiones HTTPS en ese puerto; no se inicia un servidor HTTP
ni una redirección desde HTTP. Si cambias el puerto, ajusta también las URLs
de `GET.http` y `index.html`.

## Probar

El certificado incluido es autofirmado para `localhost`. Puedes confiar
explícitamente en él para una petición local:

```powershell
curl.exe --cacert ssl/cert.pem https://localhost:3000/sodas
curl.exe --cacert ssl/cert.pem "https://localhost:3000/sodas?tipo=normal"
curl.exe --cacert ssl/cert.pem https://localhost:3000/hola
```

`GET.http` contiene más ejemplos y `index.html` permite enviar un archivo a
`https://localhost:3000/subir`. Los navegadores y clientes REST pueden rechazar
el certificado autofirmado: configura la confianza en el certificado de desarrollo.
El certificado actual no incluye Subject Alternative Name (SAN), por lo que algunos
clientes requerirán reemplazarlo por uno con `DNS:localhost` en ese campo.
No desactives la validación TLS globalmente. En producción usa un certificado
válido emitido por una autoridad de confianza.

HTTPS cifra el transporte; no añade autenticación por API key. La configuración
de autenticación existente en `routes/sodaRouter.js` está asociada a una aplicación
Express separada, no al router exportado.
