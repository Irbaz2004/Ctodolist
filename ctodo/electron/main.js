// electron/main.js
import path from 'path';
import { fileURLToPath } from 'url';
import { app, BrowserWindow } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html')).then(() => {
      // Reset the URL to root after load
      win.webContents.executeJavaScript(`
        if (window.location.pathname !== '/') {
          window.history.replaceState({}, '', '/');
        }
      `);
    });
  }
}

// 🟨 This function runs before launching the window
async function customSetup() {
  console.log("Running setup before launching the window...");
  // Simulate an async task (e.g., DB check, file read, etc.)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Setup complete!");
}

// 🟩 This starts the app
app.whenReady().then(async () => {
  await customSetup();     // ⬅️ Runs first
  createWindow();          // ⬅️ Then shows window
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
