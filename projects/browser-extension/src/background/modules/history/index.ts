import browser from "webextension-polyfill"

import { LogFormat } from "~helpers/LogFormat"
import { type ImportHistoryRecord } from "~types"

const logFormat = new LogFormat("history")

export const DEFAULT_MAX_RESULTS = 10000
export const DEFAULT_HISTORY_DAYS_FROM_TODAY = 300

export function getDateBefore(days: number): number {
  const currentDate = new Date()
  const targetDate = new Date(currentDate)
  targetDate.setDate(currentDate.getDate() - days)
  return targetDate.getTime()
}

export async function getHistory({
  endTime,
  startTime,
  maxResults,
  text
}: {
  endTime?: number
  startTime?: number
  maxResults?: number
  text?: string
}): Promise<ImportHistoryRecord[]> {
  const historyItems = await browser.history.search({
    text: text ?? "",
    maxResults: maxResults ?? DEFAULT_MAX_RESULTS,
    startTime: startTime ?? getDateBefore(DEFAULT_HISTORY_DAYS_FROM_TODAY),
    endTime: endTime ?? Date.now()
  })
  console.info(...logFormat.formatArgs("getHistory", historyItems))
  return historyItems
}
export const init = async () => {
  console.info(...logFormat.formatArgs("init"))
}
