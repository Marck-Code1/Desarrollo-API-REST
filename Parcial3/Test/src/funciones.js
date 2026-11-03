/**
 * Muestra en la consola un saludo y lo devuelve.
 *
 * @param {string} nombre - El nombre de la persona a saludar.
 * @returns {string} El saludo generado.
 * @example
 * hola("Marco");
 */
export function hola(nombre) {
    const saludo = `Hola, ${nombre}!!!`; 
    console.log(saludo);
    return saludo;
}
