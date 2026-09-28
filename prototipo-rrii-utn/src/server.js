const express = require('express');
const cors = require('cors');
const path = require('path');
const SheetConnector = require('./acceso_datos/integracion_google_sheets/SheetConnector');
const GestorAdmPaises = require('./logica_negocio/administracion_paises/GestorAdmPaises');

const app = express();
// Puerto típico para desarrollo local del backend
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite que el frontend en React (que correrá en otro puerto en desarrollo) consuma la API
app.use(express.json());

// 1. Configuración de la Base de Datos (Google Sheets)
const credentialsPath = path.join(__dirname, 'acceso_datos/integracion_google_sheets/credentials.json');
const spreadsheetId = 'A65ER6E51SBWETQasdasalsf342359we0foqqeqw'; // El ID que sacas de la URL del Sheet de Relaciones Internacionales
// Actualizamos el rango para abarcar las 11 columnas (A hasta K)
const rangoConsulta = 'Hoja 1!A2:K'; 

// Instanciación de componentes
const sheetConnector = new SheetConnector(credentialsPath, spreadsheetId);
const gestorPaises = new GestorAdmPaises(sheetConnector);

// Función de inicialización asíncrona
async function inicializarSistema() {
    try {
        console.log("Iniciando conexión con Google Sheets...");
        await sheetConnector.conectar();
        await gestorPaises.cargarDatosDesdeSheet(rangoConsulta);
        console.log('✅ Sistema inicializado: Datos de universidades cargados en memoria.');
    } catch (error) {
        console.error('❌ Error al inicializar los datos:', error.message);
        console.warn('⚠️  Revisa que credentials.json sea válido y el spreadsheetId sea correcto.');
    }
}

// 2. Endpoints (API REST para la capa de Presentación)

// GET: Lista básica de países para popular el menú o select en React
app.get('/api/paises', (req, res) => {
    try {
        const listaPaises = gestorPaises.obtenerPaises();
        res.status(200).json(listaPaises);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el listado de países' });
    }
});

// GET: Datos completos del país seleccionado
app.get('/api/paises/:nombre', (req, res) => {
    try {
        // Descodificamos el nombre por si viene con espacios o caracteres especiales desde la URL
        const nombrePais = decodeURIComponent(req.params.nombre); 
        
        // El Gestor toma el control del flujo de la petición
        const seleccionExitosa = gestorPaises.tomarSeleccionPais(nombrePais);
        
        if (!seleccionExitosa) {
            return res.status(404).json({ error: `El país '${nombrePais}' no se encuentra registrado.` });
        }

        // Si existe, consultamos los datos delegando a la clase Pais
        const datosPais = gestorPaises.consultarPais();
        res.status(200).json(datosPais);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud' });
    }
});

// 3. Configuración para el despliegue monolítico (Archivos estáticos de React)
const reactBuildPath = path.join(__dirname, '../paisesPressWeb/build');
app.use(express.static(reactBuildPath));

// Redirección para React Router (Single Page Application)
app.get('*', (req, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
});

// 4. Arranque del servidor
app.listen(PORT, async () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    // Se cargan los datos en memoria al arrancar para que las respuestas de la API sean inmediatas
    await inicializarSistema(); 
});