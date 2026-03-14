const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize:  () => ipcRenderer.send('window-minimize'),
  maximize:  () => ipcRenderer.send('window-maximize'),
  close:     () => ipcRenderer.send('window-close'),

  // Sync: triggers do-sync from main → shell.html
  sync: () => ipcRenderer.send('sync-panel'),

  // Events pushed from main process to renderer
  onWindowState: (cb) => ipcRenderer.on('window-state',  (_, s) => cb(s)),
  onNavigateTo:  (cb) => ipcRenderer.on('navigate-to',   (_, p) => cb(p)),
  onDoSync:      (cb) => ipcRenderer.on('do-sync',       (_, ts) => cb(ts)),

  platform: process.platform,
});
