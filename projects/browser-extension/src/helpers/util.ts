import _ from "lodash"

export const releaseMemory = (target: any) => {
  if (_.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      releaseMemory(target.pop())
    }
  }

  target = undefined
  return true
}
