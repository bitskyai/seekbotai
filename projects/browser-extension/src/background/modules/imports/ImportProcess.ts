import { updateImportBookmarks, prepareStartImportBookmarks, startImportBookmarks } from "~storage"

import ImportThread from "./ImportThread"

export class ImportProcess {
  static MAX_CONCURRENT = 20
  static DEFAULT_TIMEOUT = 1000 * 60 * 60 * 2
  private concurrent: number = 10
  private timeout: number = ImportProcess.DEFAULT_TIMEOUT
  private stopped: boolean = true
  private inited = false
  private importThreads: ImportThread[] = []

  constructor({ concurrent, timeout }: { concurrent?: number, timeout?: number }) {
    if (concurrent) {
      this.concurrent =
        concurrent <= ImportProcess.MAX_CONCURRENT
          ? concurrent
          : ImportProcess.MAX_CONCURRENT
    }
    if (timeout) {
      this.timeout = timeout
    }
    this.init()
  }

  async init() {
    this.inited = false;
    await prepareStartImportBookmarks({ syncUpBookmarks: true })
    this.inited = true
  }

  async start() {
    if (!this.inited) {
      await this.init()
    }
    this.stopped = false;
    let inProgressBookmarks = await startImportBookmarks({concurrentBookmarks:this.concurrent})
    while(!this.stopped&&inProgressBookmarks.length>0) {
      // reset 
      this.importThreads = []
      for(let i=0;i<inProgressBookmarks.length;i++) {
        let bookmark = inProgressBookmarks[i]
        let importThread = new ImportThread({url:bookmark.url, timeout:this.timeout})
        this.importThreads.push(importThread)

        const pagesData = await  Promise.all(this.importThreads.map((thread)=>thread.start()))
        await updateImportBookmarks(pagesData)

        // fetch next
        inProgressBookmarks = await startImportBookmarks({concurrentBookmarks:this.concurrent})
      }
    }

    this.stopped = true;
  }

  async stop() {
    this.stopped = true;
    await Promise.all(this.importThreads.map((thread)=>thread.stop()))
    return true;
  }
}
