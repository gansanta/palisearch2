const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

let windows = {}

let palisearchwindow

function createWindow(attributes=null,filename="palisearch.html") {
  let window = new BrowserWindow({
      width: 800,
      height: 600,
      icon: path.join(__dirname, 'images/search16.ico'),
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
function setMenu(){
  var menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          click(){
            createWindow(null,"palisearch.html")
          },
          accelerator: "CmdOrCtrl+N"
        },
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
      ]
   },
   {
     label: 'Tools',
     submenu: [
		    {role: 'reload'},
        { role: 'toggleDevTools' },
     ]
  },
   {
      label: 'About',
      click(){
        let fwindow = BrowserWindow.getFocusedWindow()
        if(fwindow) fwindow.webContents.send("show-about-alertbox")
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
    icon: path.join(__dirname, 'images/search16.ico')
  })

  palisearchwindow.loadFile('palisearch.html')


  setMenu()


  
}

app.whenReady().then(createPaliSearchWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const ipcMain = require('electron').ipcMain

ipcMain.on('opennewwindow',(ipcevent, attributes)=>{
  createWindow(attributes,"palisearch.html")
  
})
