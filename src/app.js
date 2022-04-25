const {app, BrowserWindow, ipcMain} = require('electron')
const { autoUpdater } = require('electron-updater');
const url = require("url");
const path = require("path");
const fs = require("fs");

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation : false
    }
  })

  mainWindow.loadURL(
    path.resolve(
      path.join(__dirname, `../dist/elite-dangerous-credit-per-hour/index.html`)
  ));

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
  mainWindow.webContents.send("update_message", app.getVersion());
}

autoUpdater.on('checking-for-update',() => {
  mainWindow.webContents.send("update_message", "checking for updates");
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

autoUpdater.on('error', (error) => {
  mainWindow.webContents.send("update_message", JSON.stringify(error));
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

ipcMain.on("AddResetEntryToLog", (event, args) => {
  var journal = GetTodaysNewestJournal(GetJournalFolderPath());
  var entry = {
    timestamp: new Date().toLocaleString('en-US', { hour12: false }),
    event: "Reset",
    about: "This is from the Elite Dangerous Credit Per Hour App and not from Elite its self."
  };
  fs.appendFileSync(journal, JSON.stringify(entry)+"\n");
});

ipcMain.on("GetJournalFilePath", (event, messageFromAngular) => {
  event.reply("GetJournalFilePath-reply", GetJournalResponse());
});

ipcMain.on("SaveData", (event, args) => {
  var userDirPath = app.getPath('home');
  var folderPath = userDirPath + "\\Saved Games\\Elite Dangerous Credit Tracker";
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  var filePath = folderPath + "\\" + args[0];
  args.slice(1).forEach(item => {
    if (fs.existsSync(filePath)) {
      fs.appendFileSync(filePath, item+"\n");
    } else {
      fs.writeFileSync(filePath, item+"\n");
    }
  });
});

var lastModified = 0;
function GetJournalResponse(){
  var response = {
    errorMessage: "",
    journal: "",
    errorOccured: false,
    lastJournalPath: lastLoadedJournal,
    currentJournalPath: ""
  };

  var journal = GetTodaysNewestJournal(GetJournalFolderPath());

  if(journal == null){
    response.journal = "Failed to find Journal.";
    return response;
  }

  try{
    var mtime = fs.statSync(journal).mtime;
    if(mtime <= lastModified){
      response.journal = null;
      return response;
    }
    lastModified = mtime;

    var data  = fs.readFileSync(journal, 'utf8');
    response.currentJournalPath = journal;
    lastLoadedJournal = journal;
    response.journal = data;

    return response;
  }
  catch{
    response.journal = "Failed to Read Journal."
    response.errorOccured = true;
    return response;
  }
}

function GetJournalFolderPath(){
  var journalPath = "\\Saved Games\\Frontier Developments\\Elite Dangerous";
  var userDirPath = app.getPath('home');

  return userDirPath+journalPath
}

var lastLoadedJournal = null;
function GetTodaysNewestJournal(folderPath){
  var today = new Date();
  var formatedDate = today.toLocaleString( 'sv', { timeZoneName: 'short' } ).split(' ')[0];

  var todaysJournals = fs.readdirSync(folderPath)
  .filter(file => file.includes("Journal."+formatedDate))
  .map(file => {
    var dateTime = file.split('.')[1].split('T')
    return {
      fileName: file,
      date: dateTime[0],
      time: parseInt(dateTime[1])
    }
  })
  .sort((a,b) => b.time - a.time);

  if(todaysJournals.length == 0){
    return lastLoadedJournal;
  }

  return folderPath + "\\" + todaysJournals[0].fileName;
}

