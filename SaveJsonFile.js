// Importar el módulo de sistema de archivos
const fs = require("fs");
const path = require("path");

/**
 * Guarda un objeto JSON en un archivo con el nombre indicado.
 * @param {string} fileName - Nombre del archivo sin extensión.
 * @param {object} data - Objeto que se desea guardar.
 * @param {string} [directory="./data"] - Carpeta donde guardar el archivo (por defecto ./data)
 */
function saveJsonFile(fileName, data, directory = "./data") {
    try {
        // Crear la carpeta si no existe
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        // Ruta completa del archivo
        const filePath = path.join(directory, `${fileName}.json`);

        // Convertir el objeto a formato JSON bonito
        const jsonContent = JSON.stringify(data, null, 2);

        // Escribir el archivo
        fs.writeFileSync(filePath, jsonContent, "utf8");

        console.log(`✅ Archivo guardado: ${filePath}`);
    } catch (err) {
        console.error("❌ Error al guardar el archivo JSON:", err);
    }
}

/**
 * Lee todos los archivos JSON dentro de una carpeta y devuelve un array con su contenido.
 * @param {string} directory - Ruta de la carpeta que contiene los archivos JSON.
 * @returns {Array<object>} - Array con los datos de cada archivo JSON.
 */
function readJsonFilesFromFolder(directory = "./data") {
    const result = [];

    try {
        // Verificar que la carpeta existe
        if (!fs.existsSync(directory)) {
            console.error("❌ La carpeta no existe:", directory);
            return [];
        }

        // Leer todos los archivos dentro de la carpeta
        const files = fs.readdirSync(directory);

        // Recorrer los archivos
        for (const file of files) {
            if (path.extname(file) === ".json") {
                const filePath = path.join(directory, file);
                const fileContent = fs.readFileSync(filePath, "utf8");

                try {
                    // Parsear el contenido JSON y añadirlo al array
                    const jsonData = JSON.parse(fileContent);
                    result.push(...jsonData);
                } catch (err) {
                    console.warn(`⚠️ No se pudo parsear el archivo ${file}:`, err.message);
                }
            }
        }
    } catch (err) {
        console.error("❌ Error al leer la carpeta:", err);
    }

    return result;
}

module.exports = {
    saveJsonFile,
    readJsonFilesFromFolder
};