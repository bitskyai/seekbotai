import { isDevMode } from "./helpers/devmode";

/**
 * Installs developer tools if we're in dev mode.
 *
 * @export
 * @returns {Promise<void>}
 */
export async function setupDevTools(): Promise<void> {
  if (!isDevMode()) return;
}
