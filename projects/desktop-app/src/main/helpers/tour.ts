import { IpcEvents } from "../../ipc-events";
import type { Tour } from "../../types";
import { ipcMainManager } from "../ipc";
import { getAppConfig } from "./config";
import { pathExistsSync, readJSONSync, writeJSONSync } from "fs-extra";

let _tour_in_memory: Tour;
function isFinishedAllSteps(tour: Tour) {
  return !!(
    tour.steps.installExtension?.finished &&
    tour.steps.importBookmarks?.finished &&
    tour.steps.search?.finished
  );
}

export async function getTour(): Promise<Tour> {
  if (_tour_in_memory) {
    return _tour_in_memory;
  }

  const config = await getAppConfig();
  if (pathExistsSync(config.DESKTOP_APP_TOUR_PATH)) {
    const tour = readJSONSync(config.DESKTOP_APP_TOUR_PATH);
    tour.finished = isFinishedAllSteps(tour);
    _tour_in_memory = tour;
  } else {
    return { steps: {} };
  }
}

export async function finishedInstallExtensionStep() {
  return await finishedStep("installExtension");
}

export async function finishedImportBookmarksStep() {
  return await finishedStep("importBookmarks");
}

export async function finishedSearchStep() {
  return await finishedStep("search");
}

export async function finishedTour() {
  const currTour = await getTour();
  currTour.notShow = true;
  return await setTour(currTour);
}

export async function finishedStep(step: string) {
  const currTour = await getTour();
  if (currTour.finished) {
    return;
  }
  if (
    step === "installExtension" &&
    !currTour.steps?.installExtension?.finished
  ) {
    currTour.steps.installExtension = { finished: true, updatedAt: Date.now() };
  } else if (
    step === "importBookmarks" &&
    currTour.steps?.installExtension?.finished &&
    !currTour.steps?.importBookmarks?.finished
  ) {
    currTour.steps.importBookmarks = { finished: true, updatedAt: Date.now() };
  } else if (
    step === "search" &&
    currTour.steps?.importBookmarks?.finished &&
    !currTour.steps?.search?.finished
  ) {
    currTour.steps.search = { finished: true, updatedAt: Date.now() };
  } else {
    return currTour;
  }
  return await setTour(currTour);
}

export async function setTour(tour: Tour): Promise<Tour> {
  _tour_in_memory = tour;
  const config = await getAppConfig();
  writeJSONSync(config.DESKTOP_APP_TOUR_PATH, tour);
  ipcMainManager.send(IpcEvents.SYNC_PRODUCT_TOUR_UPDATED, [
    { status: "success", payload: tour },
  ]);
  return tour;
}

export async function resetTour(): Promise<Tour> {
  const config = await getAppConfig();
  writeJSONSync(config.DESKTOP_APP_TOUR_PATH, { steps: {} });
  _tour_in_memory = { steps: {} };
  return { steps: {} };
}
