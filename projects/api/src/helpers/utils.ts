export function getPlatformName(): string {
  const isDarwin = process.platform === "darwin";
  if (isDarwin && process.arch === "arm64") {
    return process.platform + "Arm64";
  }

  return process.platform;
}
