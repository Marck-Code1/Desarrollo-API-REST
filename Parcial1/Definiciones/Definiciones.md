# Definiciones

## ¿Qué es un API?

Una API (Application Programming Interface), o interfaz de programación de aplicaciones, es un conjunto de reglas o protocolos que permiten que las aplicaciones de software se comuniquen entre sí para intercambiar datos, características y funcionalidades.

Permite intercambiar datos entre sistemas diferentes sin necesidad de conocer como están construidos internamente

Por ejemplo, si se va a construir una página web/aplicación móvil/aplicación de escritorio sobre perros, la API de imágenes de perros existe para que el sistema pueda solicitar las imágenes que tiene la API.

## ¿Qué es REST?

Rest significa Representational State Transfer, es una arquitectura que establece varios principios y restricciones que se pueden utilizar para el diseño de una API.

Entre las restricciones y principios REST, una establece que hay que utilizar recursos, que pueden ser identificados con una URL.
Si tengo un recurso de datos de alumnos, puedo acceder a su información de esta manera

/alumnos
/alumnos/15

y para consultar la información, actualizar o borrar esa información en el caso de una API Web, utilizamos los verbos HTTP como:

* GET : Consulta de información
* POST : Creación de recurso
* PUT : Actualizar un recurso
* DELETE : Eliminar un recurso

También se necesita representarlos en algún formato como XML,HTML,texto,o como el siguiente ejemplo en JSON

```json
{
  "NumControl": 1,
  "nombre": "Pablito",
  "carrera": "Ingeniería en Sistemas"
}
```

También una restricción importante es que las peticiones no dependan de una anterior para saber que información se está solicitando.
Cada solicitud debe contener la información necesaria para que el servidor pueda procesarla.

## ¿A que se refiere el término RestFul?

Restful hace referencia a un sistema o API que sigue los principios y restricciones REST.

Por ejemplo si nos referimos a una API RESTful, es una API que sigue la arquitectura REST en su diseño, y es intercambiable con el término API REST.
