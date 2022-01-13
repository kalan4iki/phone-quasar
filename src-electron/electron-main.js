import { app, BrowserWindow, netLog, nativeTheme, Tray, Menu, ipcMain, Notification, net } from 'electron'
import path from 'path'
import { autoUpdater } from "electron-updater"
const log = require('electron-log');
app.disableHardwareAcceleration()
if (process.env.PROD) {
  autoUpdater.checkForUpdatesAndNotify()
}
try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }
function showNotification (title, bodys) {
  const notification = {
    title: title,
    body: bodys,
    icon: path.resolve(__statics, 'linux-512x512.png')
  }
  new Notification(notification).show()
}
// Обновление
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
log.info(process.env.NODE_ENV)
const server = 'http://ph.istra-adm.ru'
// const url = `${server}/update/${process.platform}/${app.getVersion()}`

// autoUpdater.setFeedURL({ url })
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
    width: 900,
    height: 800,
    // useContentSize: true,
    // frame: false,
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
  mainWindow.webContents.setFrameRate(60)
}

let appIcon = null

app.on('ready', () => {
  
  netLog.startLogging(path.resolve(__dirname, '/logs.log'))
  appIcon = new Tray(path.resolve(__statics, 'linux-512x512.png'))


  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Открыть приложение',
  //     click: () => {
  //       mainWindow.show()
  //     }
  //   },
  //   {
  //     label: 'Закрыть',
  //     click: () => {
  //       appIcon.destroy()
  //       app.exit()
        
  //     }
  //   }
  // ])
  // appIcon.on('click', () => {
  //   mainWindow.show()
  // });
  // appIcon.setToolTip('Список телефонов')
  // appIcon.setContextMenu(contextMenu)
  
  // Создание окна
  createWindow()
  //showNotification('Тест', 'Запущено приложение')
})

ipcMain.on('hide-window-user', () => {
  // mainWindow.hide()
  app.quit()
})

const events = require('events');
const ee1 = new events.EventEmitter();
// ee1.on('click', (event) => {
//   console.log(event)
//   mainWindow.show()
// })

ee1.on('click', () => {console.log(appIcon)});

app.on('window-all-closed', (event) => {
  // event.preventDefault()
  // mainWindow.hide()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// app.on('before-quit', (event) => {
//   event.preventDefault()
//   mainWindow.hide()
// })

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})



// autoUpdater.on('checking-for-update', () => {
//   showNotification('Обновление', 'Проверка обновления.')
// })

// autoUpdater.on('update-available', (info) => {
//   showNotification('Обновление', 'Доступно обновление.')
// })

autoUpdater.on('error', (err) => {
  showNotification('Обновление', 'Ошибка при попытки обновлении.')
  log.error(err);
  console.error(err)
})
autoUpdater.on('update-downloaded', (info) => {
  showNotification('Обновление', 'Начинается обновление.')
  autoUpdater.quitAndInstall(true);  
})
// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//   showNotification('Обновление', releaseName)
//   autoUpdater.quitAndInstall()
// })

// autoUpdater.on('error', message => {
//   console.error('Ошибка при попытки обновлении')
//   console.error(message)
// })