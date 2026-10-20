const initialSodas = require("../data/sodas");

function createSodaRepository() {
  // Cada instancia mantiene su propia colección; las pruebas no comparten estado.
  const sodas = initialSodas.map((soda) => ({ ...soda }));
  let nextId = Math.max(...sodas.map((soda) => soda.id)) + 1;

  return {
    findAll(tipo) {
      return sodas
        .filter((soda) => !tipo || soda.tipo === tipo)
        .map((soda) => ({ ...soda }));
    },

    findById(id) {
      const soda = sodas.find((item) => item.id === id);
      return soda ? { ...soda } : null;
    },

    create(datos) {
      const soda = { id: nextId++, ...datos };
      sodas.push(soda);
      return { ...soda };
    },

    update(id, datos) {
      const index = sodas.findIndex((soda) => soda.id === id);
      if (index === -1) return null;

      sodas[index] = { ...sodas[index], ...datos };
      return { ...sodas[index] };
    },

    delete(id) {
      const index = sodas.findIndex((soda) => soda.id === id);
      if (index === -1) return false;

      sodas.splice(index, 1);
      return true;
    },
  };
}

module.exports = createSodaRepository;
