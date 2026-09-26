# Estructura de un archivo WSDL

**WSDL (Web Services Description Language)** es un lenguaje basado en XML que se utiliza para describir un Web Service. Para un servicio **SOAP**, el archivo WSDL define qué operaciones ofrece el servicio, qué datos recibe y devuelve, y dónde se encuentra disponible.

## Estructura básica

Un archivo WSDL está formado principalmente por los siguientes elementos:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<definitions
    xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    targetNamespace="http://ejemplo.com/servicio">

    <types>
        <!-- Definición de tipos de datos -->
    </types>

    <message>
        <!-- Mensajes de entrada y salida -->
    </message>

    <portType>
        <!-- Operaciones que ofrece el servicio -->
    </portType>

    <binding>
        <!-- Cómo se implementan las operaciones mediante SOAP -->
    </binding>

    <service>
        <!-- Dirección donde está disponible el servicio -->
    </service>

</definitions>
```

## Elementos principales

### 1. definitions

Es el elemento raíz del documento WSDL. Contiene toda la descripción del Web Service.

También suele incluir los **namespaces (espacios de nombres)** necesarios para utilizar XML Schema, SOAP y el propio WSDL.

Estos espacios de nombres pueden contener el prefijo necesario para invocarlos en los elementos.

```xml
<definitions
    xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    targetNamespace="http://ejemplo.com/servicio">
```

### 2. types

Define los tipos de datos que utilizará el servicio. Normalmente se utiliza **XML Schema (XSD)** para definir estos datos.

```xml
<types>
    <xsd:schema targetNamespace="http://ejemplo.com/servicio">
        <xsd:element name="ObtenerUsuario">
            <xsd:complexType>
                <xsd:sequence>
                    <xsd:element name="id" type="xsd:int"/>
                </xsd:sequence>
            </xsd:complexType>
        </xsd:element>
    </xsd:schema>
</types>
```

### 3. message

Define los mensajes que se intercambian entre el cliente y el Web Service.

Puede existir un mensaje para la **entrada (request)** y otro para la **respuesta (response)**.

```xml
<message name="ObtenerUsuarioRequest">
    <part name="parameters" element="tns:ObtenerUsuario"/>
</message>

<message name="ObtenerUsuarioResponse">
    <part name="parameters" element="tns:Usuario"/>
</message>
```

### 4. portType

Define las operaciones que ofrece el Web Service y los mensajes utilizados por cada operación.

```xml
<portType name="UsuarioPortType">
    <operation name="ObtenerUsuario">
        <input message="tns:ObtenerUsuarioRequest"/>
        <output message="tns:ObtenerUsuarioResponse"/>
    </operation>
</portType>
```

En este ejemplo, el servicio ofrece una operación llamada `ObtenerUsuario`.

### 5. binding

Indica cómo se implementará la comunicación definida en el `portType`. Para un Web Service SOAP, aquí se especifican elementos relacionados con SOAP, como el estilo y el transporte utilizado.

```xml
<binding name="UsuarioBinding" type="tns:UsuarioPortType">
    <soap:binding
        style="document"
        transport="http://schemas.xmlsoap.org/soap/http"/>

    <operation name="ObtenerUsuario">
        <soap:operation soapAction="http://ejemplo.com/ObtenerUsuario"/>
    </operation>
</binding>
```

### 6. service

Define el servicio y proporciona la dirección donde el cliente puede acceder al Web Service.

```xml
<service name="UsuarioService">
    <port name="UsuarioPort" binding="tns:UsuarioBinding">
        <soap:address location="http://ejemplo.com/UsuarioService"/>
    </port>
</service>
```

## Estructura de WSDL en breve

```text
types    (Tipos permitidos)
  ↓
message  (Mensajes a enviar y recibir)
  ↓
portType (Operaciones disponibles)
  ↓
binding  (Protocolo de comunicación)
  ↓
service  (Definición de la dirección del servicio)
  ↓
URL del Web Service
```

WSDL funciona como un contrato entre el cliente y el Web Service SOAP, describiendo formalmente la forma en que ambos deben comunicarse.
