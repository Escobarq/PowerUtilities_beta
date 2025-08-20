import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import Store from 'electron-store'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// Crea la ventana principal y configura su comportamiento y preferencias.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    title: 'Power Utility',
    autoHideMenuBar: true,
    icon: join(__dirname, '../../resources/icon/icono_128x128.svg'),

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Mostrar la ventana cuando el contenido esté listo.
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Abrir enlaces externos en el navegador por defecto.
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Cargar la URL de desarrollo si existe; en producción, cargar el HTML local.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Helper para registrar atajos globales desde la configuración
function registerAllHotkeys(hotkeys = {}, mainWindow) {
  try {
    globalShortcut.unregisterAll()
  } catch {
    // ignore
  }

  // Small helper: normalize user-provided strings like "SUPER + K" -> "Super+K"
  function normalizeAccelerator(input) {
    if (!input || typeof input !== 'string') return input
    // Split on + or whitespace, keep tokens
    const parts = input
      .split(/\+/)
      .map((p) => p.trim())
      .filter(Boolean)

    if (parts.length === 0) return input

    const alias = {
      SUPER: 'Super',
      CMD: 'CommandOrControl',
      COMMAND: 'CommandOrControl',
      COMMANDORCONTROL: 'CommandOrControl',
      CTRL: 'Control',
      CONTROL: 'Control',
      ALT: 'Alt',
      OPTION: 'Alt',
      SHIFT: 'Shift',
      WIN: 'Super'
    }

    const normalizedParts = parts.map((token) => {
      const t = token.toUpperCase()
      if (alias[t]) return alias[t]
      // common names
      if (t === 'SPACE') return 'Space'
      if (t === 'PRINT') return 'PrintScreen'
      // Single character -> uppercase
      if (/^[a-z0-9]$/i.test(token)) return token.toUpperCase()
      // Function keys (f1..f12)
      if (/^F\d{1,2}$/i.test(token)) return token.toUpperCase()
      // Default: title-case the token
      return token.charAt(0).toUpperCase() + token.slice(1)
    })

    return normalizedParts.join('+')
  }

  for (const [key, accel] of Object.entries(hotkeys)) {
    if (!accel) continue
    const normalized = normalizeAccelerator(accel)
    try {
      globalShortcut.register(normalized, () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('hotkey:triggered', key)
        }
      })
    } catch (error) {
      console.error('No se pudo registrar atajo', accel, 'normalized->', normalized, error)
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('hotkeys:register-failed', {
          key,
          accel,
          normalized,
          message: String(error)
        })
      }
    }
  }
}

// Inicialización de la aplicación: configurar ID, atajos y crear la ventana.
app.whenReady().then(() => {
  // Identificador de la aplicación en Windows (para notificaciones y jumplists).
  electronApp.setAppUserModelId('com.electron')

  // Habilitar/gestionar atajos útiles en desarrollo y producción.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Ejemplo simple de IPC desde renderer a main.
  // handler 'ping' removido para evitar logs innecesarios.

  // Instanciar store y exponer handlers para hotkeys
  // Guardamos un objeto { hotkeys, enabled } para ser explícitos.
  // electron-store puede exportarse como CommonJS o ESM dependiendo de la
  // resolución del bundler; normalizamos la exportación para asegurar que
  // `Store` sea un constructor/clase.
  const StoreClass = Store && Store.default ? Store.default : Store
  const store = new StoreClass()

  ipcMain.handle('hotkeys:get', () => {
    const persisted = store.get('hotkeys', {})
    // Compatibilidad: si persisted no tiene la forma { hotkeys, enabled }
    // retornamos { hotkeys: persisted, enabled: {} }
    if (persisted && !persisted.hotkeys && Object.keys(persisted).length) {
      return { hotkeys: persisted, enabled: {} }
    }
    return persisted
  })

  ipcMain.handle('hotkeys:set', (event, payload) => {
    // payload preferiblemente { hotkeys, enabled }
    const toStore = {}
    if (payload) {
      if (payload.hotkeys) toStore.hotkeys = payload.hotkeys
      if (payload.enabled) toStore.enabled = payload.enabled
      // legacy: si se pasó map de atajos directamente
      if (!toStore.hotkeys && Object.keys(payload).length) toStore.hotkeys = payload
    }

    store.set('hotkeys', toStore)

    // Re-registrar atajos usando la ventana principal si existe
    const win = BrowserWindow.getAllWindows()[0]
    registerAllHotkeys(toStore.hotkeys || {}, win)
    return true
  })

  createWindow()

  // Registrar atajos iniciales desde la store después de crear la ventana
  const win = BrowserWindow.getAllWindows()[0]
  const persistedRaw = store.get('hotkeys', {})
  const persisted = persistedRaw && persistedRaw.hotkeys ? persistedRaw.hotkeys : persistedRaw
  registerAllHotkeys(persisted || {}, win)

  // En macOS, reabrir la ventana si no hay ninguna cuando la app se activa.
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Cerrar la aplicación cuando todas las ventanas se cierren (excepto en macOS).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Unregister global shortcuts before quit
    try {
      globalShortcut.unregisterAll()
    } catch (error) {
      console.warn('Error al unregisterAll', error)
    }
    app.quit()
  }
})

// Resto del código específico del proceso principal puede añadirse aquí.
