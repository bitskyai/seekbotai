import _ from "lodash"
import normalizeUrl from "normalize-url"

export const releaseMemory = (target: any) => {
  if (_.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      releaseMemory(target.pop())
    }
  }

  target = undefined
  return true
}

export const normalizeUrlWithoutError = (url: string) => {
  try {
    return normalizeUrl(url)
  } catch (err) {
    return url
  }
}
