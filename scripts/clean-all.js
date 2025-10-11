const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Iniciando limpieza completa del proyecto...');

try {
  // Detener procesos de Node.js
  console.log('🛑 Deteniendo procesos de Node.js...');
  try {
    execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
  } catch (error) {
    console.log('ℹ️  No hay procesos de Node.js ejecutándose');
  }

  // Limpiar .next
  console.log('🗑️  Eliminando carpeta .next...');
  try {
    execSync('cmd /c "rmdir /s /q .next"', { stdio: 'ignore' });
    console.log('✅ Carpeta .next eliminada');
  } catch (error) {
    console.log('ℹ️  Carpeta .next no existe o ya fue eliminada');
  }

  // Limpiar node_modules (opcional, solo si hay problemas)
  const shouldCleanNodeModules = process.argv.includes('--deep');
  if (shouldCleanNodeModules) {
    console.log('🗑️  Eliminando node_modules...');
    try {
      execSync('cmd /c "rmdir /s /q node_modules"', { stdio: 'ignore' });
      console.log('✅ node_modules eliminado');
    } catch (error) {
      console.log('ℹ️  node_modules no existe o ya fue eliminado');
    }
  }

  // Limpiar caché de npm
  console.log('🧹 Limpiando caché de npm...');
  execSync('npm cache clean --force', { stdio: 'inherit' });

  // Reinstalar dependencias si se eliminó node_modules
  if (shouldCleanNodeModules) {
    console.log('📦 Reinstalando dependencias...');
    execSync('npm install', { stdio: 'inherit' });
  }

  console.log('✅ Limpieza completa finalizada');
  console.log('🚀 Puedes ejecutar "npm run dev" para iniciar el servidor');

} catch (error) {
  console.error('❌ Error durante la limpieza:', error.message);
  process.exit(1);
}


