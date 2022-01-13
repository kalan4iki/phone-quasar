import { app, BrowserWindow, netLog, nativeTheme, Tray, Menu, ipcMain, Notification, net } from 'electron'
import path from 'path'
import { autoUpdater } from "electron-updater"

// __dirname = path.resolve();
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
const server = 'http://ph.istra-adm.ru'
// const url = `${server}/update/${process.platform}/${app.getVersion()}`

// autoUpdater.setFeedURL({ url })

if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 800,
    useContentSize: true,
    // frame: false,
    webPreferences: {
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
      contextIsolation: false
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
  createWindow()
})

ipcMain.on('hide-window-user', () => {
  // mainWindow.hide()
  app.quit()
})

const events = require('events');
const ee1 = new events.EventEmitter();

ee1.on('click', () => {console.log(appIcon)});

app.on('window-all-closed', (event) => {
  // event.preventDefault()
  // mainWindow.hide()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

autoUpdater.on('error', (err) => {
  showNotification('Обновление', 'Ошибка при попытки обновлении.')
  log.error(err);
  console.error(err)
})
autoUpdater.on('update-downloaded', (info) => {
  showNotification('Обновление', 'Начинается обновление.')
  autoUpdater.quitAndInstall(true);  
})