const fs = require('fs').promises;
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');
const NUM_FILES = 200 // Cambia esto al número que quieras

async function createOutputDir() {
    try {
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
    } catch (err) {
        console.error("Error creating output directory:", err);
    }
}

async function generateFile(index) {
    const content = `Archivo número ${index}\nContenido generado automáticamente.`;
    const filename = path.join(OUTPUT_DIR, `file_${index}.txt`);
    await fs.writeFile(filename, content);
}

async function main() {
    console.time('Tiempo de Generación');
    console.log(`Generando ${NUM_FILES} archivos...`);
    await createOutputDir();

    const tasks = [];

    for (let i = 0; i < NUM_FILES; i++) {
        tasks.push(generateFile(i));
    }

    // Ejecutar todas las tareas asincrónicas en paralelo
    await Promise.all(tasks);
    console.timeEnd('Tiempo de Generación');
    console.log(`Archivos generados en: ${OUTPUT_DIR}`);
    console.log(`${NUM_FILES} archivos generados exitosamente.`);
}

main().catch(console.error);
