// Modules
const {app, BrowserWindow, session, dialog} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  // let customSes = session.fromPartition('persist:part1');
  let ses = session.defaultSession

  let getCookies = () => {
    ses.cookies.get({name:'cookie1'}, (err, cookies) => {
      console.log(cookies);
    })
  }

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: { nodeIntegration: true }
  })

  ses.on('will-download', (e, downloadItem, webContents) => {
    console.log('Starting download:')
    let fileName = downloadItem.getFilename()
    let fileSize = downloadItem.getTotalBytes()

    downloadItem.setSavePath(app.getPath('desktop') + `/${fileName}`)

    downloadItem.on('updated', (e, state) => {
      let received = downloadItem.getReceivedBytes()

      if (state === 'progressing' && received) {
        let progress = Math.round((received/fileSize)*100)
        console.log(progress)
        webContents.executeJavaScript(`window.progress.value = ${progress}`)
      }
    })
  })

  // secWindow = new BrowserWindow({
  //   width: 600, height: 600,
  //   x: 200, y: 200,
  //   webPreferences: { 
  //     nodeIntegration: true, 
  //     partition: 'persist:part1'
  //   }
  // })

  // let ses = mainWindow.webContents.session;
  // let ses2 = mainWindow.webContents.session;
  // let defaultSes = session.defaultSession;

  // ses.clearStorageData();

  // console.log(Object.is(ses, customSes));

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')

  let cookie = {url:'https://myappdomain.com', name:'cookie1', value:'eletron', expirationDate: '2019-09-12'}

  // ses.cookies.set(cookie, err => {
  //   console.log('cookie1 set')
  //   getCookies()
  // })

  mainWindow.webContents.on('did-finish-load', e => {
    getCookies();
  })
  // secWindow.loadFile('index.html')

  mainWindow.webContents.on('did-finish-load', () => {
    // dialog.showOpenDialog(mainWindow, {
    //   buttonLabel: 'Select a photo',
    //   defaultPath: app.getPath('home'),
    //   properties: ['multiSelections', 'createDirectory', 'openFile']
    // }, filepaths => {
    //   console.log(filepaths)
    // })
    // dialog.showSaveDialog({}, filename => {
    //   console.log(filename)
    // })
    const answers = ['Yes', 'No', 'Maybe']
    dialog.showMessageBox({
      title: 'Message Box',
      message: 'Please select an option',
      detail: 'Message details.',
      buttons: answers
    }, Response => {
      console.log(`User selected ${answers[Response]}`)
    })
  })

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();
  // secWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
  // secWindow.on('closed',  () => {
  //   secWindow = null
  // })
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
