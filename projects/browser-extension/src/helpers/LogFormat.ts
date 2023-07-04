/* eslint-disable @typescript-eslint/no-empty-function */
const colors = [
  "#9933CC",
  "#33CC99",
  "#0033FF",
  "#33CC33",
  "#CC3333",
  "#33CCCC",
  "#00CC66",
  "#FF0033",
  "#CCCC00",
  "#3300CC",
  "#CC3399",
  "#6633FF",
  "#33CC00",
  "#6633CC",
  "#FF0066",
  "#CC6633",
  "#FF9933",
  "#66CC33",
  "#CC00CC",
  "#FF3399",
  "#FFCC33",
  "#3399FF",
  "#CC6600",
  "#00CCCC",
  "#CC0099",
  "#FFCC00",
  "#0066FF",
  "#9933FF",
  "#0000CC",
  "#CC9933",
  "#3333CC",
  "#CC0000",
  "#FF33FF",
  "#FF6600",
  "#33CCFF",
  "#CC3366",
  "#00CCFF",
  "#CC33CC",
  "#0066CC",
  "#6600FF",
  "#FF6633",
  "#FF3366",
  "#33CC66",
  "#CC0033",
  "#CC00FF",
  "#3333FF",
  "#0099FF",
  "#3366CC",
  "#CCCC33",
  "#6600CC",
  "#3300FF",
  "#FF0000",
  "#0033CC",
  "#9900FF",
  "#FF3300",
  "#99CC00",
  "#00CC99",
  "#CC3300",
  "#0099CC",
  "#9900CC",
  "#0000FF",
  "#FF33CC",
  "#CC0066",
  "#FF00CC",
  "#CC9900",
  "#00CC00",
  "#FF00FF",
  "#99CC33",
  "#CC33FF",
  "#FF3333",
  "#FF9900",
  "#00CC33",
  "#3366FF",
  "#3399CC",
  "#FF0099",
  "#66CC00"
]

let colorIndex = 0

export class LogFormat {
  private namespace: string
  private color: string
  private dateTimeColor = "#ababab"
  private appName = "BI"

  constructor(namespace: string) {
    this.namespace = namespace
    this.color = colors[colorIndex++ % colors.length]
  }

  formatDate(date: Date) {
    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    const minute =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    const second =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
    const millisecond = date.getMilliseconds()
    return `${hour}:${minute}:${second}.${millisecond}`
  }

  formatArgs(...args) {
    const argsArray = Array.prototype.slice.call(args)
    const dateTimeStyles = [`color: ${this.dateTimeColor}`]
    const namespaceStyles = [`color: ${this.color}`, `font-weight: bold`]
    return [
      `%c[${this.formatDate(new Date())}] %c${
        this.appName + "/" + this.namespace
      }`,
      `${dateTimeStyles.join(";")}`,
      `${namespaceStyles.join(";")}`
    ].concat(argsArray)
  }
}

export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4
}

// TODO: make logLevel configurable
const logLevel = LogLevel.DEBUG

if (logLevel > LogLevel.DEBUG) {
  console.debug = () => {}
  console.log = () => {}
} else if (logLevel > LogLevel.INFO) {
  console.info = () => {}
} else if (logLevel > LogLevel.WARN) {
  console.warn = () => {}
} else if (logLevel > LogLevel.ERROR) {
  console.error = () => {}
}
