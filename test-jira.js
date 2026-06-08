const domain = process.env.ATLASSIAN_DOMAIN;
const email = process.env.ATLASSIAN_EMAIL;
const token = process.env.ATLASSIAN_API_TOKEN;

if (!domain || !email || !token) {
  console.error("❌ Error: Faltan variables de entorno en el archivo .env.");
  console.error("Asegúrate de copiar .env.template a .env y llenar los datos.");
  process.exit(1);
}

// Codificar credenciales en Base64 para Basic Auth
const auth = Buffer.from(`${email}:${token}`).toString('base64');

async function testConnection() {
  const url = `https://${domain}/rest/api/3/myself`;
  console.log(`🔍 Conectando a Jira en: https://${domain}...`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("\n✅ ¡Conexión exitosa a Jira!");
    console.log(`👤 Usuario autenticado: ${data.displayName}`);
    console.log(`📧 Email: ${data.emailAddress}`);
    console.log(`🆔 AccountId: ${data.accountId}`);
  } catch (error) {
    console.error("\n❌ Error al conectar con Jira:");
    console.error(error.message);
  }
}

testConnection();
