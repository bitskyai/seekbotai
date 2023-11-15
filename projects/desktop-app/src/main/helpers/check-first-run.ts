import { getAppConfig } from "./config";
import logger from "./logger";
import * as fs from "fs-extra";

/**
 * Whether or not the app is being run for
 * the first time
 *
 * @returns {boolean}
 */
export async function isFirstRun(): Promise<boolean> {
  const appConfig = await getAppConfig();
  const firstTimeRunFilePath = appConfig.DESKTOP_APP_FIRST_TIME_RUN_FILE_PATH;
  try {
    if (fs.existsSync(firstTimeRunFilePath)) {
      return false;
    }

    fs.outputFileSync(
      firstTimeRunFilePath,
      JSON.stringify({ version: appConfig.VERSION }),
    );
    logger.info(
      "utils->check-first-run->isFirstRun, writ file to path: ",
      firstTimeRunFilePath,
    );
  } catch (error) {
    console.warn(`First run: Unable to write firstRun file`, error);
  }

  return true;
}
