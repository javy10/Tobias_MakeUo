// src/lib/simple-alerts.ts
// Sistema de alertas simple sin dependencias externas

export interface SimpleErrorInfo {
  title: string;
  message: string;
  solution: string;
  error?: any;
}

export function showSimpleErrorAlert(errorInfo: SimpleErrorInfo) {
  const { title, message, solution, error } = errorInfo;
  
  // Crear modal simple
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;
  
  content.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <div style="width: 24px; height: 24px; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
        <span style="color: white; font-weight: bold;">!</span>
      </div>
      <h3 style="margin: 0; color: #dc2626; font-size: 18px;">ERROR: ${title}</h3>
    </div>
    <p style="margin: 0 0 15px 0; color: #374151;">${message}</p>
    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
      <strong style="color: #0369a1;">💡 SOLUCIÓN SUGERIDA:</strong><br>
      <span style="color: #0c4a6e;">${solution}</span>
    </div>
    <button onclick="this.closest('.modal').remove()" style="
      background: #dc2626;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    ">Entendido</button>
  `;
  
  modal.className = 'modal';
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Auto-remover después de 10 segundos
  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }, 10000);
}

export function showSimpleSuccessAlert(title: string, message: string) {
  // Crear modal simple
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;
  
  content.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
        <span style="color: white; font-weight: bold;">✓</span>
      </div>
      <h3 style="margin: 0; color: #10b981; font-size: 18px;">${title}</h3>
    </div>
    <p style="margin: 0 0 15px 0; color: #374151;">${message}</p>
    <button onclick="this.closest('.modal').remove(); window.location.href='/';" style="
      background: #10b981;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    ">Entendido</button>
  `;
  
  modal.className = 'modal';
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Auto-remover y redirigir después de 5 segundos
  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
    // Redirigir a la página principal
    window.location.href = '/';
  }, 5000);
}
