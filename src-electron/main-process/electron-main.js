import { app, BrowserWindow, nativeTheme, Tray, Menu, ipcMain, autoUpdater, Notification } from 'electron'
import path from 'path'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

// Обновление

const server = 'http://ph.istra-adm.ru'
const url = `${server}/update/${process.platform}/${app.getVersion()}`

autoUpdater.setFeedURL({ url })
/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    useContentSize: true,
    frame: false,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

let appIcon = null

app.on('ready', () => {
  appIcon = new Tray(path.resolve(__statics, 'linux-512x512.png'))


  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Открыть приложение',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Закрыть',
      click: () => {
        appIcon.destroy()
        app.quit()
      }
    }
  ])
  appIcon.on('click', () => {
    mainWindow.show()
  });
  appIcon.setToolTip('Demo')
  appIcon.setContextMenu(contextMenu)
  
  // Создание окна
  createWindow()
  
})

ipcMain.on('hide-window-user', () => {
  mainWindow.hide()
})

const events = require('events');
const ee1 = new events.EventEmitter();
// ee1.on('click', (event) => {
//   console.log(event)
//   mainWindow.show()
// })

ee1.on('click', () => {console.log(appIcon)});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function showNotification (title, bodys) {
  const notification = {
    title: title,
    body: bodys
  }
  new Notification(notification).show()
}

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  showNotification('Обновление', releaseName)
  autoUpdater.quitAndInstall()
})

autoUpdater.on('error', message => {
  console.error('Ошибка при попытки обновлении')
  console.error(message)
})