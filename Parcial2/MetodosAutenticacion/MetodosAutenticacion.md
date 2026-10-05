# Métodos de autenticación

## Autenticación Básica

La **autenticación básica** utiliza un nombre de usuario y una contraseña para identificarnos.

Ese usuario y contraseña se codifican a Base64 y se mandan en el header de `Authorization`

## Digest y funciones de hash

Genera un Hash a partir de ciertos datos, como el usuario, contraseña y otros valores de la petición.

El cliente hace cálculos con una llave que manda el servidor, el servidor intenta hacer el
cálculo con los datos que envío al cliente, y si coincide, otorga la autorización.

## Autenticación Bearer

La autenticación **Bearer** utiliza un **token** en lugar de mandar el usuario y contraseña en cada petición.

El servidor asigna un token al usuario, y este lo manda en cada petición en el header `Authorization`, el token suele tener una fecha de expiración corta

## API Key

Una **API Key** es una clave que una aplicación utiliza para identificarse al hacer peticiones a una API.

Al igual que bearer el servidor asigna la llave, pero le da una duración larga, para acceso prolongado hasta que se revoque.

Tiene su propio header `x-api-key`.

## JSON Web Token (JWT)

**JWT (JSON Web Token)** es un formato de token que permite guardar información dentro del mismo token.

Se codifica a Base64 y con una llave secreta, se confirma que los datos no hayan sido modificados.

## OAuth

**OAuth** permite acceder a un servicio, mediante otro servicio.

Como por ejemplo, puedes hacer una cuenta de Facebook, utilizando tu cuenta de Google en vez de tener que crear una contraseña nueva.
