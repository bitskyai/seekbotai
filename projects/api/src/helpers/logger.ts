import { getAppConfig } from "./config";
import { DEFAULT_APP_OPTIONS } from "./constants";
import fs from "fs-extra";
import path from "path";
import { createLogger, format, Logger, transports } from "winston";

// Only need one logger instance in whole system
let logger: Logger;

export default function getLogger() {
  try {
    // if (logger) {
    //   // console.log('logger already created.');
    //   return logger;
    // }
    const config = getAppConfig();
    const logFilesPath = config.WEB_APP_LOG_FILES_PATH;
    fs.ensureDirSync(logFilesPath);
    // console.log('[createLogger] starting...');
    logger = createLogger({
      level: config.WEB_APP_LOG_LEVEL,
      format: format.combine(
        format.ms(),
        format.errors({ stack: true }),
        format.timestamp(),
        format.splat(),
        format.json(),
      ),
      defaultMeta: {
        service: config.WEB_APP_NAME,
      },
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new transports.File({
          filename: config.WEB_APP_COMBINED_LOG_FILE_PATH,
          level: "error",
          tailable: true,
          maxsize: config.WEB_APP_LOG_MAX_SIZE,
          maxFiles: 1,
        }),
        new transports.File({
          filename: config.WEB_APP_ERROR_LOG_FILE_PATH,
          tailable: true,
          maxsize: config.WEB_APP_LOG_MAX_SIZE,
          maxFiles: 1,
        }),
      ],
    });
    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (config.NODE_ENV !== "production") {
      logger.add(
        new transports.Console({
          format: format.simple(),
        }),
      );
    }

    // console.log('[createLogger] end');
    return logger;
  } catch (err) {
    console.error("error: ", err);
    return console;
  }
}
