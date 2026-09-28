class Documentacion {
    #docGoogle; // Enlace

    constructor(docGoogle) {
        this.#docGoogle = docGoogle;
    }

    get docGoogle() { return this.#docGoogle; }
    set docGoogle(val) { this.#docGoogle = val; }

    obtenerInfoDocumentacion() {
        return {
            documento: this.#docGoogle
        };
    }
}

module.exports = Documentacion;