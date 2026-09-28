class Universidad {
    #nombre;
    #tipoEstablecimiento;
    #contacto;
    #cicloLectivo;
    #sistemaMedicion;

    constructor(nombre, tipoEstablecimiento, contacto, cicloLectivo, sistemaMedicion) {
        this.#nombre = nombre;
        this.#tipoEstablecimiento = tipoEstablecimiento;
        this.#contacto = contacto;
        this.#cicloLectivo = cicloLectivo;
        this.#sistemaMedicion = sistemaMedicion;
    }

    // Getters
    get nombre() { return this.#nombre; }
    get tipoEstablecimiento() { return this.#tipoEstablecimiento; }
    get contacto() { return this.#contacto; }
    get cicloLectivo() { return this.#cicloLectivo; }
    get sistemaMedicion() { return this.#sistemaMedicion; }

    // Setters
    set nombre(val) { this.#nombre = val; }
    set tipoEstablecimiento(val) { this.#tipoEstablecimiento = val; }
    set contacto(val) { this.#contacto = val; }
    set cicloLectivo(val) { this.#cicloLectivo = val; }
    set sistemaMedicion(val) { this.#sistemaMedicion = val; }

    obtenerInfoUniversidad() {
        return {
            nombre: this.#nombre,
            tipoEstablecimiento: this.#tipoEstablecimiento,
            contacto: this.#contacto,
            cicloLectivo: this.#cicloLectivo,
            sistemaMedicion: this.#sistemaMedicion
        };
    }
}

module.exports = Universidad;