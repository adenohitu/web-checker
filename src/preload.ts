import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  resizeWindow: (width: number) => ipcRenderer.send("resize-window", width),
  setOpacity: (opacity: number) => ipcRenderer.send("set-opacity", opacity),
});
