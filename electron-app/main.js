const { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage } = require('electron');
const path = require('path');

const PANEL_URL = 'https://www.vizualx.online';

let mainWindow = null;
let splashWindow = null;
let tray = null;
let isQuitting = false;

const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  app.quit();
}

app.on('second-instance', () => {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
});

// ─── Splash ───────────────────────────────────────────────────────────────────
function createSplash() {
  splashWindow = new BrowserWindow({
    width: 460,
    height: 280,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    center: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
}

// ─── Main Window ──────────────────────────────────────────────────────────────
function createMain() {
  const iconPath = path.join(__dirname, 'build', 'icon.png');

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    show: false,
    title: 'VizualX Panel',
    icon: iconPath,
    frame: true,
    autoHideMenuBar: true,
    backgroundColor: '#0f1115',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      devTools: !app.isPackaged,
    },
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadURL(`${PANEL_URL}/dashboard?desktop=1`);

  mainWindow.webContents.on('did-finish-load', () => {
    try {
      mainWindow?.webContents.setZoomFactor(1);
      mainWindow?.webContents.setVisualZoomLevelLimits(1, 1);
    } catch {}
  });

  mainWindow.once('ready-to-show', () => {
    const delay = splashWindow && !splashWindow.isDestroyed() ? 2500 : 0;
    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) splashWindow.close();
      mainWindow.show();
      mainWindow.focus();
    }, delay);
  });

  // Minimize to tray on close
  mainWindow.on('close', (e) => {
    if (!isQuitting && tray) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ─── System Tray ──────────────────────────────────────────────────────────────
function createTray() {
  let img = nativeImage.createEmpty();
  const candidates = ['tray.ico', 'tray.png', 'icon.png'];
  for (const name of candidates) {
    try {
      const p = path.join(__dirname, 'build', name);
      const tmp = nativeImage.createFromPath(p);
      if (!tmp.isEmpty()) { img = tmp; break; }
    } catch {}
  }

  tray = new Tray(img);
  tray.setToolTip('VizualX Panel');

  const menu = Menu.buildFromTemplate([
    { label: 'Hap VizualX Panel', click: showMain },
    { type: 'separator' },
    { label: 'Dashboard',    click: () => navigateTray('/dashboard') },
    { label: 'Klientët',     click: () => navigateTray('/clients') },
    { label: 'Faturat',      click: () => navigateTray('/invoices') },
    { label: 'Projektet',    click: () => navigateTray('/projects') },
    { label: 'Sinkronizo',   click: () => mainWindow?.webContents.reloadIgnoringCache() },
    { type: 'separator' },
    { label: 'Dil', click: () => { isQuitting = true; app.quit(); } },
  ]);
  tray.setContextMenu(menu);
  tray.on('double-click', showMain);
}

function showMain() {
  if (!mainWindow) createMain();
  else { mainWindow.show(); mainWindow.focus(); }
}

function navigateTray(p) {
  showMain();
  mainWindow?.loadURL(`${PANEL_URL}${p}?desktop=1`);
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────
ipcMain.on('open-devtools', () => mainWindow?.webContents.openDevTools());

// ─── App Ready ────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createSplash();
  createMain();
  createTray();

  app.on('activate', () => {
    if (!mainWindow) createMain();
    else showMain();
  });
});

app.on('before-quit', () => { isQuitting = true; });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { isQuitting = true; app.quit(); }
});
