var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var ipcMain = require('electron').ipcMain;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var wins = {};
var gvalues = {};
function init() {
    var debugMain = false;
    var debugAll = false;
    ipcMain.on('channel0', function (event, cmd, arg1, arg2, arg3) {
        if (cmd == "set") {
            gvalues[arg1] = arg2;
            event.returnValue = 'set ok';
            return;
        }
        if (cmd == "get") {
            event.returnValue = gvalues[arg1];
            return;
        }
        if (cmd == "open") {
            if (wins[arg1] != undefined && wins[arg1] != null) {
                event.returnValue = "still open";
                return;
            }
            createWindow(arg1, "file://" + __dirname + "/" + arg2, debugAll);
            event.returnValue = "open ok";
            return;
        }
        if (cmd == "towin") {
            if (arg1 == "_all_") {
                for (var iw in wins) {
                    if (wins[iw] == undefined)
                        continue;
                    if (wins[iw].webContents == undefined)
                        continue;
                    if (wins[iw].webContents == event.sender)
                        continue;
                    wins[iw].send("channel0", arg2, arg3);
                }
                event.returnValue = "send to all ok";
                return;
            }
            if (arg1 == "_all_withme_") {
                for (var iw in wins) {
                    if (wins[iw] == undefined)
                        continue;
                    if (wins[iw].webContents == undefined)
                        continue;
                    wins[iw].send("channel0", arg2, arg3);
                }
                event.returnValue = "send to all ok";
                return;
            }
            {
                var wom = wins[arg1];
                if (wom == undefined || wom.webContents == undefined) {
                    event.returnValue = "send fail.";
                    return;
                }
                wom.webContents.send("channel0", arg2, arg3);
                event.returnValue = "send ok";
                return;
            }
        }
        event.returnValue = 'unknown cmd.';
    });
    createWindow("main", "file://" + __dirname + "/index.html", debugMain);
}
function createWindow(name, url, debug) {
    // Create the browser window.
    wins[name] = new BrowserWindow({ useContentSize: true, autoHideMenuBar: true, darkTheme: true, titleBarStyle: "hidden" });
    if (debug)
        wins[name].webContents.openDevTools();
    // and load the index.html of the app.
    wins[name].loadURL(url);
    //if (key)
    //{
    //    wins[name].on('close', (e) =>
    //    {
    //        if (confirm("really quit the main win？"))
    //        {
    //        }
    //        else
    //        {
    //            e.preventDefault();
    //        }
    //    });
    //}
    // Emitted when the window is closed.
    wins[name].on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        wins[name] = null;
        if (name == "main") {
            if (process.platform !== 'darwin') {
                app.exit(0);
            }
        }
    });
    wins[name].onbeforeonload = function (e) {
        e.returnValue = false;
    };
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (wins["main"] === null) {
        init();
    }
});
//# sourceMappingURL=elemain.js.map