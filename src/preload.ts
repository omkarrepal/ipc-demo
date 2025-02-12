import { contextBridge, ipcRenderer } from "electron";
import { API } from "./api";
import { MAIN_EVENTS } from "./main-events";


const pingPongApi = {
    fromRender: (dummyPayload: any, pongCb: any) => {
        // this is ping from renderer, in real world scenario it could be directly coming as trigger from main
        // such as for checking updates or an action triggered from electron menu.
        ipcRenderer.invoke(MAIN_EVENTS.PING_FROM_RENDERER, [dummyPayload]);
        // it will trigger a callback setup on renderer once invoked with data.
        ipcRenderer.on(MAIN_EVENTS.PONG_FROM_MAIN, (event, args) => pongCb(args));
    }
}

const systemApi = {
    getSystemInfo: () => {
        return ipcRenderer.invoke(MAIN_EVENTS.GET_SYSTEM_INFO);
    }
}

const loginApi = {
    launchLoginWindow: () => {
        return ipcRenderer.invoke(MAIN_EVENTS.START_LOGIN);
    }
}

const todoApi = {
    addTodo: (todo: string, todoCb: any) => {
        // this is ping from renderer, in real world scenario it could be directly coming as trigger from main
        // such as for checking updates or an action triggered from electron menu.
        ipcRenderer.invoke(MAIN_EVENTS.ADD_TODO, [todo]);
        // it will trigger a callback setup on renderer once invoked with data.
        ipcRenderer.on(MAIN_EVENTS.SEND_TODO, (event, args) => {
            todoCb(args);
            // unregister event after so that it woulc not trigger for other update
            ipcRenderer.off(MAIN_EVENTS.SEND_TODO, () => {});
        });
    },
    removeTodo: (index: number, todoCb: any) => {
        ipcRenderer.invoke(MAIN_EVENTS.REMOVE_TODO, [index]);
        ipcRenderer.on(MAIN_EVENTS.SEND_TODO, (event, args) => {
            todoCb(args);
            // unregister event after so that it woulc not trigger for other update
            ipcRenderer.off(MAIN_EVENTS.SEND_TODO, () => {});
        });
    }
}

contextBridge.exposeInMainWorld(API.PING_PONG, pingPongApi);

contextBridge.exposeInMainWorld(API.SYSTEM, systemApi);

contextBridge.exposeInMainWorld(API.LOGIN, loginApi);

contextBridge.exposeInMainWorld(API.TODO, todoApi);
