import { app, shell, BrowserWindow, ipcMain } from 'electron'
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

// Inicialización de la aplicación: configurar ID, atajos y crear la ventana.
app.whenReady().then(() => {

  // Identificador de la aplicación en Windows (para notificaciones y jumplists).
  electronApp.setAppUserModelId('com.electron')

  // Habilitar/gestionar atajos útiles en desarrollo y producción.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Ejemplo simple de IPC desde renderer a main.
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  // En macOS, reabrir la ventana si no hay ninguna cuando la app se activa.
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Cerrar la aplicación cuando todas las ventanas se cierren (excepto en macOS).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Resto del código específico del proceso principal puede añadirse aquí.
