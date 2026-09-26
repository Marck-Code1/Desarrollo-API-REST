const soap = require('soap');

// URL de la definición del servicio (WSDL)
const wsdlUrl = "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL";

async function obtenerPaises() {
  try {
    //Crea el cliente SOAP leyendo el WSDL de la API
    const client = await soap.createClientAsync(wsdlUrl);
    const result = await client.ListOfCountryNamesByNameAsync({});
    console.log("Lista de países obtenida exitosamente:");
    console.dir(result, { depth: null }); 
    
  } catch (error) {
    console.error("Error al consumir el servicio SOAP:", error);
  }
}

obtenerPaises();
