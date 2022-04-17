const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')



let splashwindow, indexwindow, palisearchwindow
function createIndexWindow () {
  indexwindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 1264,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    //show: false,
    icon: path.join(__dirname, 'images/picon.png')
  })

  indexwindow.loadFile('index.html')

  setMenu()
  /**
   * indexwindow.once('ready-to-show', ()=>{
    indexwindow.show()
  })
   */
}
function createWindow(attributes=null,filename="index.html") {
  let window = new BrowserWindow({
      height: 800,
      width: 1264,
      icon: path.join(__dirname, 'images/picon.png'),
      backgroundColor: '#606061',
      webPreferences: {
          nodeIntegration: true,
          webviewTag: true,
          contextIsolation: false,
          enableRemoteModule: true
      }
  })
  window.loadURL('file://' + path.join(__dirname, filename))

  setMenu()

  return window
}
function setMenu(window){
  var menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
         {role: 'quit'}
      ]
   },
    {
      label: 'Edit',
      submenu: [
         {role: 'cut'},
         {role: 'copy'},
         {role: 'paste'},
         {role: 'selectAll'},
         {role: 'separator'},
         {
			 label: 'Search History',
			 click(){
				 if(window === palisearchwindow)window.webContents.send("show-search-history")}
		}
      ]
   },
   {
     label: 'Tools',
     submenu: [
		{role: 'reload'},
        {role: 'toggleDevTools'}
     ]
  },
   {
      label: 'About',
      click(){
        window.webContents.send("show-about-alertbox")
      }
   }
  ])
  Menu.setApplicationMenu(menu)
}
function createPaliSearchWindow () {
  palisearchwindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    //show: false,
    icon: path.join(__dirname, 'images/picon.png')
  })

  palisearchwindow.loadFile('palisearch.html')

  setMenu(palisearchwindow)
  
}
function createSplashWindow() {
  splashwindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 700,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    transparent: true,
    frame: false,
    show:false
    //alwaysOnTop: true
  })

  splashwindow.loadFile('splashloader.html')
  splashwindow.once('ready-to-show', ()=>{
    splashwindow.show()
  })

  createIndexWindow()
}

app.whenReady().then(createPaliSearchWindow)
//app.whenReady().then(createSplashWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const ipcMain = require('electron').ipcMain
ipcMain.on("close-splash-window", (event, arg)=>{
  setTimeout(handleSplashCloseSignal, 3000)
})
ipcMain.on('opennewwindow',(ipcevent, attributes)=>{
  createWindow(attributes)
})


function handleSplashCloseSignal(){
  splashwindow.close()
  //createIndexWindow()
  indexwindow.show()

  //let ipcmain = require('electron').ipcMain
  //ipcmain.send
  indexwindow.webContents.send("test-db")

}
