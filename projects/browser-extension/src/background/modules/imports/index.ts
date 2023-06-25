import { ImportProcess } from "./ImportProcess"

export const IMPORT_BOOKMARKS_JOB_TIMEOUT = 1000 * 60 * 60 * 2 // 2 hours
export const PARALLEL_IMPORT_BOOKMARKS_COUNT = 5

const _importProcess = new ImportProcess({})

export const startImportBookmarks = async () => {
  _importProcess.start()
}

export const stopImportBookmarks = async () => {
  _importProcess.stop()
}
