import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// API pública disponible para el renderer (añadir aquí tus métodos personalizados)
const api = {}

// Si el renderer corre con contextIsolation habilitado, exponer las APIs
// de forma segura usando contextBridge. Si no, adjuntar al global window
// para mantener compatibilidad (menos seguro).
if (process.contextIsolated) {
  try {
    // API proporcionada por @electron-toolkit/preload (funcionalidades de Electron)
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // API propia para extender funcionalidades desde el preload
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    // Registrar errores al exponer las APIs sin detener la carga del renderer
    console.error('Error al exponer APIs al renderer:', error)
  }
} else {
  // Modo no aislado: asignar al objeto global window (uso recomendado solo en entornos controlados)
  window.electron = electronAPI
  window.api = api
}
