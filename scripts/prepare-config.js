const fs = require('fs');
const path = require('path');

/**
 * Script de preparación de configuración para despliegues (Render, Vercel, VPS, Docker).
 * 1. Garantiza que exista public/assets/config/config.json a partir de config.example.json
 *    si se realiza un clone limpio (evitando errores 404 en CI/CD).
 * 2. Si existen variables de entorno (como API_URL o MOCK_AUTH en Render/Vercel),
 *    las inyecta automáticamente en config.json antes de la compilación de Angular.
 */
function prepareConfig() {
  const configDir = path.join(__dirname, '..', 'public', 'assets', 'config');
  const configPath = path.join(configDir, 'config.json');
  const examplePath = path.join(configDir, 'config.example.json');

  // 1. Asegurar existencia de config.json
  if (!fs.existsSync(configPath)) {
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, configPath);
      console.log('[prepare-config] Creado config.json desde config.example.json');
    } else {
      console.warn('[prepare-config] Advertencia: No se encontró config.example.json');
      return;
    }
  }

  // 2. Inyectar variables de entorno si están presentes
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(raw);
    let modified = false;

    if (process.env.API_URL) {
      config.apiUrl = process.env.API_URL.trim();
      modified = true;
      console.log(`[prepare-config] Inyectado API_URL: ${config.apiUrl}`);
    }

    if (process.env.MOCK_AUTH !== undefined) {
      config.featureFlags = config.featureFlags || {};
      config.featureFlags.mockAuth = process.env.MOCK_AUTH.trim().toLowerCase() === 'true';
      modified = true;
      console.log(`[prepare-config] Inyectado mockAuth: ${config.featureFlags.mockAuth}`);
    }

    if (modified) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
      console.log('[prepare-config] config.json actualizado exitosamente.');
    } else {
      console.log('[prepare-config] config.json verificado y listo.');
    }
  } catch (err) {
    console.error('[prepare-config] Error al procesar config.json:', err);
  }
}

prepareConfig();

