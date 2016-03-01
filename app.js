"use strict";

const electron = require("electron");
const app = electron.app;
const ipc = electron.ipcMain;
const Tray = electron.Tray;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

var path = require("path");
var Positioner = require("electron-positioner");
// require utils
var utils = require("./utils.js");

var iconIdle = path.join(__dirname, "images", "tray-idle-icon.png");


let mainWindow;

app.on("ready", function(){
  var cachedBounds;
  var appIcon = new Tray(iconIdle);
  var contextMenu = Menu.buildFromTemplate([
    { label: "Settings", submenu: [{ label: "Notifications", type: "checkbox" }]},
    { type: "separator" },
    { label: "Exit", click: function() { app.quit(); } }
  ]);
  appIcon.setContextMenu(contextMenu);
  var windowPosition = (utils.isWindows) ? "trayBottomCenter" : "trayCenter";

  initWindow();

  appIcon.on("click", function(e, bounds){
    if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return hideWindow();
    if (appIcon.window && appIcon.window.isVisible()) return hideWindow();
    bounds = bounds || cachedBounds;
    cachedBounds = bounds;
    showWindow(cachedBounds);
  });

  function initWindow(){
    var defaults = {
      width: 400,
      height: 350,
      show: false,
      frame: false,
      resizable: false,
      webPreferences: {
        overlayScrollbars: true
      },
      transparent: true
    }

    appIcon.window = new BrowserWindow(defaults);
    appIcon.positioner = new Positioner(appIcon.window);
    appIcon.window.loadURL(path.join(__dirname, "views", "index.html"));
    appIcon.window.on("blur", hideWindow);
    appIcon.window.setVisibleOnAllWorkspaces(true);
  }

  function showWindow(trayPos){
    var noBoundsPosition;
    if (!utils.isDarwin && trayPos !== undefined) {
      var displaySize = electron.screen.getPrimaryDisplay().workAreaSize;
      var trayPosX = trayPos.x;
      var trayPosY = trayPos.y;

      if (utils.isLinux) {
        var cursorPointer = electron.screen.getCursorScreenPoint();
        trayPosX = cursorPointer.x;
        trayPosY = cursorPointer.y;
      }

      var x = (trayPosX < (displaySize.width / 2)) ? "left" : "right";
      var y = (trayPosY < (displaySize.height / 2)) ? "top" : "bottom";

      if (x === 'right' && y === 'bottom') {
        noBoundsPosition = (isWindows) ? 'trayBottomCenter' : 'bottomRight';
      } else if (x === 'left' && y === 'bottom') {
        noBoundsPosition = 'bottomLeft';
      } else if (y === 'top') {
        noBoundsPosition = (isWindows) ? 'trayCenter' : 'topRight';
      }
    }else if(trayPos === undefined){
      noBoundsPosition = (utils.isWindows) ? "bottomRight" : "topRight";
    }

    var position = appIcon.positioner.calculate(noBoundsPosition || windowPosition, trayPos);
    appIcon.window.setPosition(position.x, position.y);
    appIcon.window.show();
  }

  function hideWindow () {
    if (!appIcon.window) return;
    appIcon.window.hide();
  }

  ipc.on('reopen-window', function() {
    showWindow(cachedBounds);
  });

});

app.on("window-all-closed", function(){
  if (utils.isDarwin) {
    app.quit();
  }
});

app.on("activate", function(){
  if (mainWindow === null) {
    createWindow();
  }
});
