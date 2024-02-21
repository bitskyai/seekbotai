import { IpcEvents } from "../../ipc-events";
import type { Tour } from "../../types";
import { ipcMainManager } from "../ipc";
import { getAppConfig } from "./config";
import { pathExistsSync, readJSONSync, writeJSONSync } from "fs-extra";

const defaultTour = { finished: false, updatedAt: Date.now(), steps: {} };

function isFinishedAllSteps(tour: Tour) {
  return (
    tour.steps.installExtension?.finished &&
    tour.steps.importBookmarks?.finished &&
    tour.steps.search?.finished
  );
}

export async function getTour(): Promise<Tour> {
  const config = await getAppConfig();
  if (pathExistsSync(config.DESKTOP_APP_TOUR_PATH)) {
    const tour = readJSONSync(config.DESKTOP_APP_TOUR_PATH);
    tour.finished = isFinishedAllSteps(tour);
  } else {
    return defaultTour;
  }
}

export async function finishedInstallExtensionStep() {
  return await setTour({ steps: { installExtension: { finished: true } } });
}

export async function finishedImportBookmarksStep() {
  return await setTour({ steps: { importBookmarks: { finished: true } } });
}

export async function finishedSearchStep() {
  return await setTour({ steps: { search: { finished: true } } });
}

export async function setTour(tour: Tour): Promise<Tour> {
  const currTour = await getTour();
  if (!tour) {
    return currTour;
  }
  tour.updatedAt = Date.now();
  if (tour?.steps?.importBookmarks) {
    tour.steps.importBookmarks.updatedAt = Date.now();
  }
  if (tour?.steps?.installExtension) {
    tour.steps.installExtension.updatedAt = Date.now();
  }
  if (tour?.steps?.search) {
    tour.steps.search.updatedAt = Date.now();
  }
  const updatedTour = { ...currTour, ...tour };
  updatedTour.finished = isFinishedAllSteps(updatedTour);
  const config = await getAppConfig();
  writeJSONSync(config.DESKTOP_APP_TOUR_PATH, updatedTour);
  ipcMainManager.send(IpcEvents.SYNC_UPDATE_PRODUCT_TOUR, [
    { status: "success", payload: updatedTour },
  ]);
  return updatedTour;
}

export async function resetTour(): Promise<Tour> {
  const config = await getAppConfig();
  writeJSONSync(config.DESKTOP_APP_TOUR_PATH, defaultTour);
  return defaultTour;
}
