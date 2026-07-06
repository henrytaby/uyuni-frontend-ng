const fs = require('fs');
const path = require('path');

function createFeature() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error('Uso: node scripts/create-feature.js <feature-origen> <feature-destino> <entidad-destino>');
    console.error('Ejemplo: node scripts/create-feature.js staff users user');
    process.exit(1);
  }

  const [sourceName, targetFolder, targetEntity] = args;
  
  const sourcePath = path.join(__dirname, '..', 'src', 'app', 'features', sourceName);
  const targetPath = path.join(__dirname, '..', 'src', 'app', 'features', targetFolder);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: El feature origen '${sourceName}' no existe en ${sourcePath}`);
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    console.error(`Error: El feature destino '${targetFolder}' ya existe en ${targetPath}`);
    process.exit(1);
  }

  // 1. Copiar el directorio completo
  fs.cpSync(sourcePath, targetPath, { recursive: true });
  console.log(`Copiado ${sourcePath} a ${targetPath}`);

  // 2. Funciones de ayuda para mayúsculas/minúsculas
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const upper = (str) => str.toUpperCase();
  
  const srcLower = sourceName.toLowerCase();
  const srcCap = capitalize(srcLower);
  const srcUpper = upper(srcLower);

  const tgtLower = targetEntity.toLowerCase();
  const tgtCap = capitalize(tgtLower);
  const tgtUpper = upper(tgtLower);

  // 3. Renombrar archivos y reemplazar contenido (recursivo)
  function renameAndReplace(currentPath) {
    const stats = fs.statSync(currentPath);
    if (stats.isDirectory()) {
      const items = fs.readdirSync(currentPath);
      for (const item of items) {
        renameAndReplace(path.join(currentPath, item));
      }
    } else {
      // Es un archivo, reemplazamos contenido
      let content = fs.readFileSync(currentPath, 'utf8');
      
      // Reemplazar respetando PascalCase, UPPERCASE y lowercase
      content = content.replace(new RegExp(srcCap, 'g'), tgtCap);
      content = content.replace(new RegExp(srcUpper, 'g'), tgtUpper);
      content = content.replace(new RegExp(srcLower, 'g'), tgtLower);
      
      fs.writeFileSync(currentPath, content, 'utf8');

      // Renombrar archivo si contiene el nombre de origen
      const basename = path.basename(currentPath);
      if (basename.includes(srcLower)) {
        const newBasename = basename.replace(new RegExp(srcLower, 'g'), tgtLower);
        const newPath = path.join(path.dirname(currentPath), newBasename);
        fs.renameSync(currentPath, newPath);
      }
    }
  }

  // 4. Renombrar directorios (recursivo de abajo hacia arriba)
  function renameDirectories(currentPath) {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        renameDirectories(itemPath); // Entramos primero
        if (item.includes(srcLower)) {
          const newItemName = item.replace(new RegExp(srcLower, 'g'), tgtLower);
          fs.renameSync(itemPath, path.join(currentPath, newItemName));
        }
      }
    }
  }

  renameAndReplace(targetPath);
  renameDirectories(targetPath);

  // 5. Actualizar app.routes.ts
  function updateAppRoutes() {
    const routesPath = path.join(__dirname, '..', 'src', 'app', 'app.routes.ts');
    if (!fs.existsSync(routesPath)) return;
    
    let content = fs.readFileSync(routesPath, 'utf8');
    
    if (content.includes(`path: '${targetFolder}'`)) {
      console.log(`La ruta para '${targetFolder}' ya existe en app.routes.ts`);
      return;
    }

    const newRoute = `      {
        path: '${targetFolder}',
        loadChildren: () => import('@features/${targetFolder}/${tgtLower}.routes').then(m => m.routes),
      },`;

    const childrenEndRegex = /(children:\s*\[[\s\S]*?)(\n\s*\]\s*\n\s*\}\s*,)/;
    
    if (childrenEndRegex.test(content)) {
      content = content.replace(childrenEndRegex, `$1\n${newRoute}$2`);
      fs.writeFileSync(routesPath, content, 'utf8');
      console.log(`Ruta para '${targetFolder}' añadida automáticamente en app.routes.ts`);
    } else {
      console.log(`Recuerda agregar las rutas de '${targetFolder}' en app.routes.ts o en tu módulo de rutas principal.`);
    }
  }

  updateAppRoutes();

  console.log(`¡Éxito! Feature '${targetFolder}' creado correctamente.`);
}

createFeature();
