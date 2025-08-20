import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// API pública disponible para el renderer (añadir aquí tus métodos personalizados)
const api = {}

// Exponemos una API simple y documentada para que el renderer pueda
// obtener/guardar los atajos y escuchar cuando se dispara alguno.
// El formato persistido es:
// { hotkeys: { key: accelerator }, enabled: { key: boolean } }
const hotkeysApi = {
  // Devuelve la estructura completa desde la store del proceso principal.
  get: () => ipcRenderer.invoke('hotkeys:get'),
  // Acepta { hotkeys, enabled } y persiste en el proceso principal.
  set: (payload) => ipcRenderer.invoke('hotkeys:set', payload),
  // Suscripción a eventos emitidos por el main cuando un atajo es disparado.
  onTriggered: (cb) => {
    const listener = (e, key) => cb(key)
    ipcRenderer.on('hotkey:triggered', listener)
    return () => ipcRenderer.removeListener('hotkey:triggered', listener)
  }
}

// Si el renderer corre con contextIsolation habilitado, exponer las APIs
// de forma segura usando contextBridge. Si no, adjuntar al global window
// para mantener compatibilidad (menos seguro).
if (process.contextIsolated) {
  try {
    // API proporcionada por @electron-toolkit/preload (funcionalidades de Electron)
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // Exponer API personalizada para hotkeys
    contextBridge.exposeInMainWorld('hotkeys', hotkeysApi)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    // Registrar errores al exponer las APIs sin detener la carga del renderer
    console.error('Error al exponer APIs al renderer:', error)
  }
} else {
  // Modo no aislado: asignar al objeto global window (uso recomendado solo en entornos controlados)
  window.electron = electronAPI
  window.hotkeys = hotkeysApi
  window.api = api
}
