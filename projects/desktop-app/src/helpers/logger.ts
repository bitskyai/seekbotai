import * as electronLogger from "electron-log";

// extend electron-log
const logger = {
  ...electronLogger,
  /**
   * Similar idea with console.group. Use this function to console a function start point
   * @param {string} funcationName: function name. Like `copyDefaultRetailer`
   */
  functionStart: (funcationName: string) => {
    electronLogger.debug(`<----- ${funcationName} `);
  },
  /**
   * Similar idea with console.groupEnd. Use this function to console a function end point
   * @param {string} funcationName: function name. Like `copyDefaultRetailer`
   */
  functionEnd: (funcationName: string) => {
    electronLogger.debug(` ${funcationName} ----->`);
  },
};

export default logger;
