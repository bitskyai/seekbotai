import { LogFormat } from "~helpers/LogFormat"
import { normalizeUrlWithoutError } from "~helpers/util"

import { isHTML, isSupportedProtocol } from "./utils"

const logFormat = new LogFormat("fetchPage")

export interface FetchPageOptions {
  url: string
  timeout?: number
  icon?: boolean
  wholePage?: boolean
}

export interface PageData {
  url?: string
  content?: string
  icon?: string
  error?: FetchPageErrorData
  warning?: FetchPageWarningData
}

export interface FetchPageErrorData {
  message: string
  status?: number
  url?: string
  code?: string
  name?: string
}

export interface FetchPageWarningData {
  message: string
}

export type RunFetch = () => Promise<PageData>
export type CancelFetch = () => void

export class FetchPageError extends Error {
  status: number
  url: string
  code: string

  constructor({
    message,
    status,
    url,
    code
  }: {
    message: string
    status?: number
    url: string
    code: string
  }) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = "FetchPageError"
    this.status = status
    this.url = url
    this.code = code
  }

  toJSON(): FetchPageErrorData {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      url: this.url,
      code: this.code
    }
  }
}

export type FetchPageInstance = {
  run: RunFetch
  cancel: CancelFetch
}

export const DEFAULT_TIMEOUT = 1 * 60 * 1000 // 1 minute

const fetchPage = ({
  url,
  timeout = DEFAULT_TIMEOUT
}: FetchPageOptions): FetchPageInstance => {
  console.debug(...logFormat.formatArgs("fetchPage", { url, timeout }))
  let run: RunFetch
  let cancel: CancelFetch

  if (isSupportedProtocol(url)) {
    url = normalizeUrlWithoutError(url)
    if (isHTML(url)) {
      const { run: runFetchPage, cancel: cancelFetchPage } = fetchPageHTML({
        url,
        timeout
      })
      run = runFetchPage
      cancel = cancelFetchPage
    } else {
      console.warn(...logFormat.formatArgs(`Not implemented yet: ${url}`))
      run = async () => {
        // TODO: implement other types
        return {
          url,
          warning: {
            message: "Not implemented yet"
          }
        }
      }
      cancel = () => undefined
    }
  } else {
    console.warn(...logFormat.formatArgs(`Protocol not supported: ${url}`))
    run = async () => {
      return {
        url,
        warning: {
          message: "Protocol not supported"
        }
      }
    }
    cancel = () => undefined
  }

  return { run, cancel }
}

const fetchWithTimeout = async (
  url: string,
  timeout = DEFAULT_TIMEOUT,
  { signal, ...options }: { signal?: AbortSignal } = {}
) => {
  console.debug(...logFormat.formatArgs("fetchWithTimeout", { url, timeout }))
  const abortController = new AbortController()
  const promise = fetch(url, { signal: abortController.signal, ...options })
  if (signal) {
    signal.addEventListener("abort", () => abortController.abort())
  }
  const timeoutHandler = setTimeout(() => abortController.abort(), timeout)
  return promise.finally(() => clearTimeout(timeoutHandler))
}

function throwErrorBasedOnResponseStatus({
  status,
  url
}: {
  status: number
  url: string
}) {
  switch (status) {
    case 401:
      return new FetchPageError({
        message: "Page is forbidden",
        status,
        code: "AUTHENTICATION_REQUIRED",
        url
      })
    case 403:
      return new FetchPageError({
        message: "Page is forbidden",
        status,
        code: "FORBIDDEN",
        url
      })
    case 404:
      return new FetchPageError({
        message: "Page not found",
        status,
        code: "NOT_FOUND",
        url
      })
    case 429:
      return new FetchPageError({
        message: "Too many requests",
        status,
        code: "TOO_MANY_REQUESTS",
        url
      })
    case 500:
    case 503:
    case 504:
      throw new FetchPageError({
        message: "Server currently unavailable",
        status,
        code: "UNAVAILABLE",
        url
      })
    default:
      throw new FetchPageError({
        message: "Unknown error",
        status,
        code: "UNKNOWN_ERROR",
        url
      })
  }
}

export const fetchPageHTML = ({
  url,
  timeout
}: FetchPageOptions): { run: RunFetch; cancel: CancelFetch } => {
  console.debug(...logFormat.formatArgs("fetchPageHTML", { url, timeout }))
  const abortController = new AbortController()
  return {
    cancel: () => abortController.abort(),
    run: async () => {
      try {
        console.debug(...logFormat.formatArgs("fetchPageHTML -> run", { url }))
        const response = await fetchWithTimeout(url, timeout, {
          signal: abortController.signal
        })
        console.debug(
          ...logFormat.formatArgs("fetchPageHTML -> run -> response", {
            response
          })
        )
        if (response.status !== 200) {
          throwErrorBasedOnResponseStatus({ status: response.status, url })
        }
        let text = ""
        if (response.ok) {
          text = await response.text()
        }
        return {
          url,
          content: text
        }
      } catch (error) {
        console.warn(
          ...logFormat.formatArgs(
            "fetchPageHTML -> run -> error",
            { error },
            { url, timeout }
          )
        )
        if (error.name === "FetchPageError") {
          return {
            url,
            error: error.toJSON() as FetchPageErrorData
          }
        }

        return {
          url,
          error: new FetchPageError({
            url,
            message: error.message,
            code: "FETCH_ERROR"
          }).toJSON()
        }
      }
    }
  }
}

export const init = async () => {
  console.debug(...logFormat.formatArgs("init"))
}

export default fetchPage
