# VizualX Panel — Desktop App (Electron)

Aplikacioni desktop i panelit VizualX, ndërtuar me Electron. Hap panelin live nga `vizualx.online` në një dritare të dedikuar me branding të plotë.

---

## Kërkesat

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **NPM 9+** (vjen me Node)

---

## Instalim & Nisje

```bash
# Hyr brenda folderit
cd electron-app

# Instalo varësitë
npm install

# Nise në mode zhvillimi
npm start
```

---

## Build i Instaluerit (.exe me Wizard)

```bash
cd electron-app

# Hapi 1 — Gjenero ikonat nga SVG (kërkon sharp)
npm run icons

# Hapi 2 — Build instalierin per Windows
npm run build:win
```

Instalieri **`.exe`** gjenerohet te `electron-app/dist/` dhe ka:
- Wizard instalimi me logo VizualX
- Shkurtore ne Desktop dhe Start Menu
- Çinstalues i integruar

---

## Struktura e Skedarëve

```
electron-app/
├── main.js              ← Procesi kryesor: dritaret, tray, IPC
├── preload.js           ← Bridge i sigurt mes main ↔ renderer
├── shell.html           ← Chrome i aplikacionit (titlebar + webview)
├── splash.html          ← Ekrani i fillimit me animacion
├── electron-builder.yml ← Konfigurim i build-it (NSIS, dmg, AppImage)
├── build/
│   ├── icon.svg         ← Burimi i ikonës (256×256)
│   ├── icon.ico         ← Win ico (auto-gjeneruar)
│   ├── icon.png         ← Linux/macOS png (auto-gjeneruar)
│   └── tray.png         ← Ikona e tray-t (auto-gjeneruar)
└── scripts/
    └── generate-icons.mjs ← Gjeneron të gjitha ikonat nga SVG
```

---

## Si funksionon Sync

| Platforma  | Mekanizmi                                              |
|------------|--------------------------------------------------------|
| **Desktop** | Butoni **Sync** bën `reloadIgnoringCache()` të webview-s |
| **Web**     | F5 ose buton Rifresko në browser                       |
| **Mobile**  | Butoni "Rifresko Panelin" në sidebar te APK-ja         |

Të tre platformat lexojnë nga i njëjti **Supabase database**, kështu që pas çdo refresh tregojnë të dhënat e njëjta.

---

## Tray (System Tray)

Aplikacioni minimizohet te System Tray kur mbyll dritaren.  
**Doppel-klik** mbi ikonën e tray-t e rihap dritaren.  
Menu tray ka lidhje të shpejta te: Dashboard, Faturat, dhe Dil.
