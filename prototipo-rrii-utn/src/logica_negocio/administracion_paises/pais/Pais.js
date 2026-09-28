class Pais {
    #nombre;
    #ciudades; // Agregación 1..* con Ciudad

    constructor(nombre) {
        this.#nombre = nombre;
        this.#ciudades = [];
    }

    get nombre() { return this.#nombre; }
    set nombre(nuevoNombre) { this.#nombre = nuevoNombre; }

    get ciudades() { return this.#ciudades; }

    agregarCiudad(ciudad) {
        this.#ciudades.push(ciudad);
    }

    eresPais() {
        return true;
    }

    obtenerDatosPais() {
        return {
            nombre: this.#nombre,
            ciudades: this.#ciudades.map(c => c.obtenerDatosCiudad())
        };
    }

    obtenerDatosCiudad(nombreCiudad) {
        const ciudad = this.#ciudades.find(c => c.nombre === nombreCiudad);
        return ciudad ? ciudad.obtenerDatosCiudad() : null;
    }
}

module.exports = Pais;