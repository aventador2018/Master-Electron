// Modules
const {app, BrowserWindow, webContents} = require('electron')
const windowStateKeeper = require('electron-window-state')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  // window state manager
  let winState = windowStateKeeper({
    defaultWidth: 1000, defaultHeight: 800
  })

  mainWindow = new BrowserWindow({
    width: winState.width, height: winState.height,
    x: winState.x, y: winState.y,
    //frame: false,
    titleBarStyle: "hidden",
    minWidth: 300, minHeight: 150,
    webPreferences: { nodeIntegration: true }
  })

  secWindow = new BrowserWindow({
    width: 700, height: 800,
    webPreferences: { nodeIntegration: true }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')
  secWindow.loadFile('index.html')

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  let wc = mainWindow.webContents

  // console.log(webContents.getAllWebContents())
  wc.on('did-finish-load', () => {
    console.log('Content fully loaded')
  })

  winState.manage(mainWindow)

  // mainWindow.on('focus', () => {
  //   console.log('Main win focused')
  // })

  // secWindow.on('focus', () => {
  //   console.log('Sec win focused')
  // })

  secWindow.on('closed', () => {
    mainWindow.maximize()
  })

  app.on('browser-window-focus', () => {
    console.log('App focused')
  })

  console.log(BrowserWindow.getAllWindows())

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
  secWindow.on('closed',  () => {
    secWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
