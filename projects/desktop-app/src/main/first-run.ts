import { isFirstRun } from "./helpers/check-first-run";
import { getAppConfig } from "./helpers/config";
import { appName } from "./helpers/constants";
import { updateUserDataPath } from "./helpers/preferences";
import { dialog } from "electron";

/**
 * Is this the first run of Fiddle? If so, perform
 * tasks that we only want to do in this case.
 */
export async function onFirstRunMaybe() {
  if (await isFirstRun()) {
    await promptSelectUserDataPathDialog();
  }
}

async function openSelectFolderDialog() {
  const result = await dialog.showOpenDialog({
    title: "Select a folder",
    properties: ["openDirectory"],
  });
  // Show a dialog to select a folder

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedFolderPath = result.filePaths[0];
    await updateUserDataPath(selectedFolderPath);
  }
}

/**
 * Ask the user if the app should be moved to the
 * applications folder.
 */
async function promptSelectUserDataPathDialog(): Promise<void> {
  const config = await getAppConfig();
  const { response } = await dialog.showMessageBox({
    type: "question",
    buttons: ["Yes", "No"],
    defaultId: 0,
    message: `Do you want to keep the default home folder? Home folder will store all your data. Default: ${config.DESKTOP_APP_USER_DATA_PATH}. If you want to change it, please select No, and select a new folder, we will create a new home folder(${appName}) under the selected folder.`,
  });

  if (response === 1) {
    await openSelectFolderDialog();
  }
}
