import fs from "fs-extra";
import path from "path";
import { createLogger, format, Logger, transports } from "winston";
import { getAppConfig } from "./config";
import { DEFAULT_APP_CONFIG } from "./constants";

// Only need one logger instance in whole system
let logger: Logger;

export default function getLogger() {
  try {
    if (logger) {
      // console.log('logger already created.');
      return logger;
    }
    const config = getAppConfig();
    const logFilesPath = path.join(
      config.APP_HOME_PATH,
      DEFAULT_APP_CONFIG.LOG_FILES_FOLDER
    );
    fs.ensureDirSync(logFilesPath);
    // console.log('[createLogger] starting...');
    logger = createLogger({
      level: config.LOG_LEVEL,
      format: format.combine(
        format.ms(),
        format.errors({ stack: true }),
        format.timestamp(),
        format.splat(),
        format.json()
      ),
      defaultMeta: {
        service: config.SERVICE_NAME,
      },
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new transports.File({
          filename: `${logFilesPath}/${DEFAULT_APP_CONFIG.ERROR_LOG_FILE_NAME}`,
          level: "error",
          tailable: true,
          maxsize: config.LOG_MAX_SIZE,
          maxFiles: 1,
        }),
        new transports.File({
          filename: `${logFilesPath}/${DEFAULT_APP_CONFIG.COMBINED_LOG_FILE_NAME}`,
          tailable: true,
          maxsize: config.LOG_MAX_SIZE,
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
        })
      );
    }

    // console.log('[createLogger] end');
    return logger;
  } catch (err) {
    console.error("error: ", err);
    return console;
  }
}
