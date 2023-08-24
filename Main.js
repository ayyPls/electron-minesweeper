const { app, BrowserWindow } = require('electron');

class Main {
    window = null
    constructor() {
        app.whenReady().then(() => {
            this.createWindow()
        })
    }
    createWindow() {
        this.window = new BrowserWindow({
            width: 1000,
            height: 1000,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            }
        })
        this.window.loadFile('index.html')
    }
}

new Main()