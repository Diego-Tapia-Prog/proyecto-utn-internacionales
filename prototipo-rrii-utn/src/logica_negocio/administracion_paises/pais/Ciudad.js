class Ciudad {
    #nombre;
    #informaciones; // Relación 1..* con Informacion

    constructor(nombre) {
        this.#nombre = nombre;
        this.#informaciones = [];
    }

    get nombre() { return this.#nombre; }
    set nombre(nuevoNombre) { this.#nombre = nuevoNombre; }

    get informaciones() { return this.#informaciones; }
    
    agregarInformacion(info) {
        this.#informaciones.push(info);
    }

    obtenerDatosCiudad() {
        return {
            nombre: this.#nombre,
            // Delega la obtención de info a cada objeto Informacion
            informacion: this.#informaciones.map(info => info.obtenerInfoInformes())
        };
    }
}

module.exports = Ciudad;