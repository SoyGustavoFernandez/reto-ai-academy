const fs = require('fs').promises;
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY;

async function callGemini(promptText) {
  if (!apiKey) {
    console.error("\n❌ Error: Falta la variable de entorno GEMINI_API_KEY en el archivo .env.");
    console.error("Para obtener una API key gratuita, visita: https://aistudio.google.com/");
    process.exit(1);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: promptText }]
      }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (HTTP ${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("No se recibió respuesta del modelo Gemini.");
  }
  return data.candidates[0].content.parts[0].text;
}

async function main() {
  try {
    console.log("🚀 Iniciando ejecución de la cadena de Prompts (Proyecto 1)...");

    // 1. Cargar archivos del proyecto
    const baseDir = __dirname;
    const prompt1Template = await fs.readFile(path.join(baseDir, 'prompt1-sintetizar.txt'), 'utf-8');
    const prompt2Template = await fs.readFile(path.join(baseDir, 'prompt2-diagnosticar.txt'), 'utf-8');
    const prompt3Template = await fs.readFile(path.join(baseDir, 'prompt3-redactar.txt'), 'utf-8');

    const arquitectura = await fs.readFile(path.join(baseDir, 'ejemplo-arquitectura.md'), 'utf-8');
    const ticket = await fs.readFile(path.join(baseDir, 'ejemplo-ticket.md'), 'utf-8');

    // 2. Ejecutar Paso 1: Sintetizar Arquitectura
    console.log("\n🧠 Paso 1: Sintetizando arquitectura técnica...");
    const prompt1 = prompt1Template.replace('{{ARQUITECTURA}}', arquitectura);
    const fichaTecnica = await callGemini(prompt1);
    console.log("✅ Ficha técnica generada.");

    // 3. Ejecutar Paso 2: Diagnosticar Ticket
    console.log("\n🔍 Paso 2: Analizando ticket y diagnosticando el problema...");
    const prompt2 = prompt2Template
      .replace('{{FICHA_TECNICA}}', fichaTecnica)
      .replace('{{TICKET}}', ticket);
    const diagnostico = await callGemini(prompt2);
    console.log("✅ Diagnóstico y queries de validación generados.");

    // 4. Ejecutar Paso 3: Redactar Comunicaciones
    console.log("\n✍️ Paso 3: Generando aviso para el chat grupal de Microsoft Teams...");
    const prompt3 = prompt3Template.replace('{{DIAGNOSTICO}}', diagnostico);
    const avisoTeams = await callGemini(prompt3);
    console.log("✅ Aviso para Teams redactado.");

    // 5. Consolidar el resultado final en un markdown
    const resultadoFinal = `# Reporte Consolidado de Copiloto de Soporte 🤖\n\n` +
      `## 1. Ficha Técnica de la Aplicación (Paso 1)\n\n${fichaTecnica}\n\n` +
      `## 2. Diagnóstico Técnico y Validación (Paso 2)\n\n${diagnostico}\n\n` +
      `## 3. Aviso Técnico para Teams (Paso 3)\n\n${avisoTeams}\n`;

    const outputPath = path.join(baseDir, 'resultado-final.md');
    await fs.writeFile(outputPath, resultadoFinal, 'utf-8');
    console.log(`\n🎉 Proceso completado con éxito!`);
    console.log(`💾 El resultado ha sido guardado en: ${outputPath}`);

  } catch (error) {
    console.error("\n❌ Ocurrió un error durante la ejecución:");
    console.error(error.message);
  }
}

main();
