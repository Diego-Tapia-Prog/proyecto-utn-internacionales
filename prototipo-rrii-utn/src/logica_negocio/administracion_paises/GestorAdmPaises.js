const Pais = require('./pais/Pais');
const Ciudad = require('./pais/Ciudad');
const Informacion = require('./informacion/Informacion');
const Universidad = require('./informacion/Universidad');
const Documentacion = require('./informacion/Documentacion');
const Ubicacion = require('./informacion/Ubicacion');

class GestorAdmPaises {
    #paises;
    #paisSeleccionado;
    #sheetConnector;

    constructor(sheetConnector) {
        this.#paises = [];
        this.#paisSeleccionado = null;
        // Inyectamos la dependencia del conector para no acoplar el Gestor a la infraestructura
        this.#sheetConnector = sheetConnector; 
    }

// --------------------------------------------------------
    // PROCESADOR: Transforma arrays crudos en objetos de Dominio
    // --------------------------------------------------------
    async cargarDatosDesdeSheet(rangoConsulta) {
        // Obtenemos los arrays crudos del Sheet (que tendrán la misma estructura que el CSV)
        const datosCrudos = await this.#sheetConnector.leerDatos(rangoConsulta);
        
        if (!datosCrudos || datosCrudos.length === 0) {
            console.log('No se encontraron datos en el origen.');
            return;
        }

        // Si la primera fila son los encabezados ("Pais", "ciudad", etc.), la omitimos
        const filasProcesar = datosCrudos[0][0].trim().toLowerCase() === 'pais' ? datosCrudos.slice(1) : datosCrudos;

        filasProcesar.forEach(fila => {
            // Mapeo exacto basado en la estructura del archivo de contacto
            const nombrePais = (fila[0] || '').trim();
            const nombreCiudad = (fila[1] || '').trim();
            const enlaceMaps = (fila[2] || '').trim();
            const univNombre = (fila[3] || '').trim();
            const univTipo = (fila[4] || '').trim();
            const univContacto = (fila[5] || '').trim();
            const univCiclo = (fila[6] || '').trim();
            const univSistema = (fila[7] || '').trim();
            const convenio = (fila[8] || '').trim();
            const docEnlace = (fila[9] || '').trim();
            const estado = (fila[10] || '').trim();

            // Si no hay país, saltamos la fila
            if (!nombrePais) return; 

            // 1. Gestión de País
            let pais = this.buscarPais(nombrePais);
            if (!pais) {
                pais = new Pais(nombrePais);
                this.#paises.push(pais);
            }

            // 2. Gestión de Ciudad (Relación 1..* con País)
            let ciudad = pais.ciudades.find(c => c.nombre === nombreCiudad);
            if (!ciudad) {
                ciudad = new Ciudad(nombreCiudad);
                pais.agregarCiudad(ciudad); 
            }

            // 3. Instanciación del componente de Información
            const universidad = new Universidad(
                univNombre, 
                univTipo, 
                univContacto, 
                univCiclo, 
                univSistema
            );
            
            const documentacion = new Documentacion(docEnlace); // 'enlace a analisis'
            const ubicacion = new Ubicacion(enlaceMaps);        // 'Enlace a Maps'
            
            // Componemos una descripción general usando el convenio y el estado
            const descripcionInfo = `Convenio: ${convenio || 'No especificado'} - Estado: ${estado || 'Sin revisar'}`;
            
            // 4. Ensamblaje Final
            const informacion = new Informacion(descripcionInfo, universidad, documentacion, ubicacion);
            ciudad.agregarInformacion(informacion);
        });

        console.log("Integración de datos finalizada: Entidades mapeadas correctamente.");
    }

    // --------------------------------------------------------
    // MÉTODOS DEL CONTROLADOR (Manejo del ciclo de la petición)
    // --------------------------------------------------------

    // Busca un país en la memoria local (método de soporte interno)
    buscarPais(nombrePais) {
        return this.#paises.find(p => p.nombre === nombrePais);
    }

    // Devuelve la lista de países disponibles (ideal para poblar un <select> en React)
    obtenerPaises() {
        // Solo devolvemos los nombres para no enviar toda la base de datos al frontend de golpe
        return this.#paises.map(pais => pais.nombre);
    }

    // El usuario en la vista React hace clic en un país, el Gestor toma la selección
    tomarSeleccionPais(nombrePais) {
        const paisEncontrado = this.buscarPais(nombrePais);
        if (paisEncontrado) {
            this.#paisSeleccionado = paisEncontrado;
            return true; // Selección exitosa
        }
        return false; // País no encontrado
    }

    // Devuelve todos los datos del país previamente seleccionado
    consultarPais() {
        if (!this.#paisSeleccionado) {
            throw new Error("No hay un país seleccionado en este momento.");
        }
        // Delega la responsabilidad de estructurar la respuesta a la clase Pais
        // Cumpliendo con el patrón Experto en Información (Information Expert)
        return this.#paisSeleccionado.obtenerDatosPais();
    }
}

module.exports = GestorAdmPaises;