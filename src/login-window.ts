import { BrowserWindow } from "electron";

/**
 * Opens login window once redirected it passes dummy auth code to main process
 * and then it's passed back to renderer.
 * @param mainWindow 
 * @returns 
 */
async function openLoginWindow(mainWindow: BrowserWindow): Promise<string> {
    return new Promise((resolve, reject) => {
        const loginWindow = new BrowserWindow({
            height: 600,
            width: 480,
            frame: true,
            parent: mainWindow,
            closable: true
        });
        loginWindow.webContents.openDevTools({
            mode: 'detach'
        });

        loginWindow.loadURL('https://practicetestautomation.com/practice-test-login/');
        
        loginWindow.webContents.on('will-redirect', (event) => {
            resolve('testAuthCode');
            loginWindow.destroy();
        });
    });
}

export {
    openLoginWindow
}
