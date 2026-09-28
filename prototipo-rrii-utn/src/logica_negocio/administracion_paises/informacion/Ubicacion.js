class Ubicacion {
    #linkMaps; // Enlace a Google Maps

    constructor(linkMaps) {
        this.#linkMaps = linkMaps;
    }

    get linkMaps() { return this.#linkMaps; }
    set linkMaps(val) { this.#linkMaps = val; }

    obtenerUbicacion() {
        return {
            mapa: this.#linkMaps
        };
    }
}

module.exports = Ubicacion;