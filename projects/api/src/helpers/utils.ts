import * as fs from "fs";
import * as path from "path";

export function getPlatformName(): string {
  const isDarwin = process.platform === "darwin";
  if (isDarwin && process.arch === "arm64") {
    return process.platform + "Arm64";
  }

  return process.platform;
}

export function getFilesByExtNames(
  dir: string,
  extNames: string[], // [".ts"]
  excludePatterns: RegExp[] = [], // ["index.ts"]
  files_: string[] = [],
): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFilesByExtNames(filePath, extNames, excludePatterns, files_);
    } else if (
      extNames.find((extName) => path.extname(filePath) === extName) &&
      !excludePatterns.find((excludePattern) =>
        excludePattern.test(path.basename(filePath)),
      )
    ) {
      files_.push(filePath);
    }
  }
  return files_;
}

export function getFolders(
  dir: string,
  excludePatterns: RegExp[] = [],
): string[] {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const folders = files
    .filter(
      (file) =>
        file.isDirectory() &&
        !excludePatterns.find((excludePattern) =>
          excludePattern.test(file.name ?? file),
        ),
    )
    .map((folder) => folder.name);

  folders.sort((folderA, folderB) => {
    if (folderA > folderB) {
      return 1;
    }

    if (folderA < folderB) {
      return -1;
    }
    return 0;
  });
  return folders;
}
