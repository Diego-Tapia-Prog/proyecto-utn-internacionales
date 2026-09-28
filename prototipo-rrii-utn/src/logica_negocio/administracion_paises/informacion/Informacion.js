class Informacion {
    #descripcion;
    #universidad;
    #documentacion;
    #ubicacion;

    constructor(descripcion, universidad, documentacion, ubicacion) {
        this.#descripcion = descripcion;
        this.#universidad = universidad;     // Instancia de Universidad
        this.#documentacion = documentacion; // Instancia de Documentacion
        this.#ubicacion = ubicacion;         // Instancia de Ubicacion
    }

    get descripcion() { return this.#descripcion; }
    set descripcion(val) { this.#descripcion = val; }

    // Getters para las relaciones
    get universidad() { return this.#universidad; }
    get documentacion() { return this.#documentacion; }
    get ubicacion() { return this.#ubicacion; }

    obtenerInfoInformes() {
        return {
            descripcion: this.#descripcion,
            // Aplicamos polimorfismo llamando a los métodos de cada objeto
            universidad: this.#universidad.obtenerInfoUniversidad(),
            documentacion: this.#documentacion.obtenerInfoDocumentacion(),
            ubicacion: this.#ubicacion.obtenerUbicacion()
        };
    }
}

module.exports = Informacion;