// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
var path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Connect to database
const DB = require('./resources/db/db').DB;

const DB_DATA = DB.connectDb();

/**
 * Method to create window for app
 */
async function createWindow() {

  global.app = "e-bk";

  // Find all items
  global.findAllItems = async function () {
    return await DB_DATA.Item.findAll({
      // Add order conditions here....
      order: [
        ['code', 'ASC'],
      ]
    });
  };

  // UpdateCreateItem
  global.createItem = async function (codeFile, pathFile) {
    return await DB_DATA.Item.create({ code: codeFile, path: pathFile });
  };

  // Delete all items
  global.deleteAllItems = async function () {
    return await DB_DATA.Item.destroy({
      where: {},
      truncate: true
    });
  };

  // UpdateFolder
  global.createFolder = async function (pathFolder) {
    return await DB_DATA.Folder.create({ path: pathFolder });
  };

  // Delete all folders
  global.deleteAllFolders = async function () {
    return await DB_DATA.Folder.destroy({
      where: {},
      truncate: true
    });
  }

  // Find folder
  global.findFolder = async function () {
    return await DB_DATA.Folder.findOne();
  };

  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    icon: path.join(__dirname, 'resources/images/icons/app.jpg'),
    backgroundColor: '#312450',
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./resources/pages/index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show()
  })

  //mainWindow.show();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})