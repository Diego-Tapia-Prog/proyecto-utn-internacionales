const { google } = require('googleapis');

class SheetConnector {
    #auth;
    #spreadsheetId;
    #sheets;

    constructor(credentialsPath, spreadsheetId) {
        this.#spreadsheetId = spreadsheetId;
        // Configuración de autenticación (requiere un archivo JSON de cuenta de servicio de Google)
        this.#auth = new google.auth.GoogleAuth({
            keyFile: credentialsPath,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
    }

    async conectar() {
        const client = await this.#auth.getClient();
        this.#sheets = google.sheets({ version: 'v4', auth: client });
        console.log("Conexión a Google Sheets establecida.");
    }

    // Método enfocado solo en leer un rango (Ej: 'Paises!A2:D')
    async leerDatos(rango) {
        try {
            const response = await this.#sheets.spreadsheets.values.get({
                spreadsheetId: this.#spreadsheetId,
                range: rango,
            });
            return response.data.values; // Devuelve un array de arrays (filas y columnas)
        } catch (error) {
            console.error('Error al leer Google Sheets:', error);
            throw error;
        }
    }
}

module.exports = SheetConnector;