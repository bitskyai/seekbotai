import {
  IpcEvents,
  ipcMainEvents,
  WEBCONTENTS_READY_FOR_IPC_SIGNAL,
} from "../ipc-events";
import { getOrCreateMainWindow } from "./windows";
import { ipcMain } from "electron";
import { EventEmitter } from "events";

/**
 * The main purpose of this class is to be the central
 * gathering place for IPC calls the main process sends
 * or listens to.
 *
 * @class IpcManager
 * @extends {EventEmitter}
 */
export class IpcMainManager extends EventEmitter {
  public readyWebContents = new WeakSet<Electron.WebContents>();
  private messageQueue = new WeakMap<
    Electron.WebContents,
    Array<[IpcEvents, Array<unknown> | undefined]>
  >();

  constructor() {
    super();

    ipcMainEvents.forEach((name) => {
      ipcMain.on(name, (...args: Array<unknown>) => this.emit(name, ...args));
    });

    ipcMain.on(
      WEBCONTENTS_READY_FOR_IPC_SIGNAL,
      (event: Electron.IpcMainEvent) => {
        this.readyWebContents.add(event.sender);

        const queue = this.messageQueue.get(event.sender);
        this.messageQueue.delete(event.sender);
        if (!queue) return;
        for (const item of queue) {
          this.send(item[0], item[1], event.sender);
        }
      },
    );
  }

  /**
   * Send an IPC message to an instance of Electron.WebContents.
   * If none is specified, we'll automatically go with the main window.
   *
   * @param {IpcEvents} channel
   * @param {Array<any>} args
   * @param {Electron.WebContents} [target]
   */
  public send(
    channel: IpcEvents,
    args?: Array<unknown>,
    target?: Electron.WebContents,
  ) {
    const _target = target || getOrCreateMainWindow().webContents;
    const _args = args || [];
    _target.send(channel, ..._args);
  }
}

export const ipcMainManager = new IpcMainManager();
