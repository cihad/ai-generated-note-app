import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";
const port = 3000; // Dev server port

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    // In development mode, load from dev server
    try {
      await mainWindow.loadURL(`http://localhost:${port}`);
      mainWindow.webContents.openDevTools();
    } catch (e) {
      console.error("Failed to load dev server:", e);
    }
  } else {
    // In production mode, load the built files
    try {
      await mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    } catch (e) {
      console.error("Failed to load production build:", e);
    }
  }

  // Handle window close
  mainWindow.on("closed", () => {
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
