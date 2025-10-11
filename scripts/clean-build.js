// scripts/clean-build.js
// Script para limpiar archivos temporales y cache en Windows/OneDrive

const fs = require('fs');
const path = require('path');

function cleanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        cleanDirectory(filePath);
        try {
          fs.rmdirSync(filePath);
        } catch (error) {
          // Ignorar errores de directorios no vacíos
        }
      } else {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          // Ignorar errores de archivos bloqueados
          console.warn(`No se pudo eliminar: ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.warn(`Error limpiando directorio ${dirPath}:`, error.message);
  }
}

function cleanBuildFiles() {
  console.log('🧹 Limpiando archivos de build...');
  
  // Limpiar .next
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    console.log('Limpiando .next...');
    cleanDirectory(nextDir);
  }
  
  // Limpiar cache de node_modules
  const nodeModulesCache = path.join(process.cwd(), 'node_modules', '.cache');
  if (fs.existsSync(nodeModulesCache)) {
    console.log('Limpiando cache de node_modules...');
    cleanDirectory(nodeModulesCache);
  }
  
  // Limpiar archivos de TypeScript
  const tsBuildInfo = path.join(process.cwd(), 'tsconfig.tsbuildinfo');
  if (fs.existsSync(tsBuildInfo)) {
    console.log('Limpiando tsconfig.tsbuildinfo...');
    try {
      fs.unlinkSync(tsBuildInfo);
    } catch (error) {
      console.warn('No se pudo eliminar tsconfig.tsbuildinfo');
    }
  }
  
  console.log('✅ Limpieza completada');
}

if (require.main === module) {
  cleanBuildFiles();
}

module.exports = { cleanBuildFiles };





