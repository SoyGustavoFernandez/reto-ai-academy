# Reto AI Academy - Copiloto de Guardias y Vacaciones 🚀

Este repositorio contiene los proyectos y scripts desarrollados para el **Reto AI Academy de Platzi** (Junio 2026). El objetivo principal es construir un portafolio de 5 proyectos utilizando Inteligencia Artificial para resolver el traspaso de conocimiento en soporte multi-cliente (UASL, SOLGAS, DyC) en nuestro squad de Baufest.

---

## 🛠️ Configuración Inicial

Para conectar este proyecto con tu instancia de Jira y validar tus accesos, sigue estos pasos:

### 1. Obtener tu Token de API de Atlassian (Jira/Confluence)
1. Ve al portal de seguridad de tu cuenta de Atlassian: [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens).
2. Haz clic en **Create API token** (Crear token de API).
3. Escribe una etiqueta descriptiva (ej. `platzi-reto-ai`) y haz clic en **Create**.
4. Copia el token generado y guárdalo en un lugar seguro (no se volverá a mostrar).

### 2. Configurar Variables de Entorno
1. En esta carpeta, haz una copia del archivo `.env.template` y llámalo `.env`.
2. Edita el archivo `.env` e introduce tus datos:
   - `ATLASSIAN_DOMAIN`: Tu subdominio de Jira (ej. `baufest.atlassian.net` o el dominio de tu cuenta gratuita).
   - `ATLASSIAN_EMAIL`: Tu correo electrónico asociado.
   - `ATLASSIAN_API_TOKEN`: El token que copiaste en el paso anterior.

### 3. Probar la Conexión
Como tienes instalado Node.js v22+, podemos ejecutar scripts con variables de entorno nativas sin dependencias externas. Ejecuta el siguiente comando en tu terminal para validar la conexión:

```bash
node --env-file=.env test-jira.js
```

Si todo está bien, verás un mensaje de éxito con tu nombre y correo electrónico en la terminal.

---

## 📅 Roadmap del Reto (Junio 2026)

1. **Proyecto 1 (10 de Jun):** Sistema de prompts interconectados para simplificar documentación técnica.
2. **Proyecto 2 (13 de Jun):** Automatización de tickets entrantes y alertas con Make/n8n.
3. **Proyecto 3 (17 de Jun):** Portal Web interno con Supabase para el squad.
4. **Proyecto 4 (27 de Jun):** Agente inteligente con MCP para consultar documentación local.
5. **Proyecto 5 (01 de Jul):** Asistente inteligente con LLM integrado para emparejamiento automático de casos de soporte.
