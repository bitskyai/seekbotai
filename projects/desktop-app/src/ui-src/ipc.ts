import type { EventResponse } from "../ipc-events";
import { IpcEvents, ipcRendererEvents } from "../ipc-events";
import { ipcRenderer } from "electron";
import { EventEmitter } from "events";

/**
 * The main purpose of this class is to be the central
 * gathering place for IPC calls the main process sends
 * or listens to.
 *
 * @class IpcManager
 * @extends {EventEmitter}
 */
export class IpcRendererManager extends EventEmitter {
  constructor() {
    super();

    ipcRendererEvents.forEach((name) => {
      ipcRenderer.on(name, (...args: Array<any>) => this.emit(name, ...args));
    });
  }

  /**
   * Central method to send an IPC message to the main process.
   * Currently very simple, but centralized here so that future
   * refactors will be a lot easier.
   *
   * @param {IpcEvents} channel
   * @param {...Array<any>} args
   * @memberof IpcRendererManager
   */
  public send(channel: IpcEvents, ...args: Array<any>) {
    return ipcRenderer.send(channel, ...args);
  }

  /**
   * Central method to send an IPC message to the main process.
   * Currently very simple, but centralized here so that future
   * refactors will be a lot easier.
   *
   * @param {IpcEvents} channel
   * @param {...Array<any>} args
   * @memberof IpcRendererManager
   */
  public sendSync(channel: IpcEvents, ...args: Array<any>): EventResponse {
    return ipcRenderer.sendSync(channel, ...args);
  }
}

const ipcRendererManager = new IpcRendererManager();
export default ipcRendererManager;
