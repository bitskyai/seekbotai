import { AboutPanelOptionsOptions, app } from "electron";

/**
 * Sets Fiddle's About panel options on Linux and macOS
 *
 * @returns
 */
export function setupAboutPanel(): void {
  if (process.platform === "win32") return;

  const options: AboutPanelOptionsOptions = {
    applicationName: "SeekBot",
    applicationVersion: app.getVersion(),
    version: process.versions.electron,
    copyright: "© seekbot.ai",
  };

  // TODO: need to implement about page information
  switch (process.platform) {
    case "linux":
      options.website = "https://www.seekbot.ai";
      break;
    case "darwin":
      options.credits = "https://www.seekbot.ai";
      break;
    default:
      // fallthrough
      options.credits = "https://www.seekbot.ai";
  }

  console.log("About Panel Options: ", options);

  app.setAboutPanelOptions(options);
}
