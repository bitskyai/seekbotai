import log from "electron-log";

// log.initialize({ spyRendererConsole: true });
// extend electron-log
const logger = {
  ...log,
  /**
   * Similar idea with console.group. Use this function to console a function start point
   * @param {string} funcationName: function name. Like `copyDefaultRetailer`
   */
  functionStart: (funcationName: string) => {
    log.debug(`<----- ${funcationName} `);
  },
  /**
   * Similar idea with console.groupEnd. Use this function to console a function end point
   * @param {string} funcationName: function name. Like `copyDefaultRetailer`
   */
  functionEnd: (funcationName: string) => {
    log.debug(` ${funcationName} ----->`);
  },
};

export default logger;
