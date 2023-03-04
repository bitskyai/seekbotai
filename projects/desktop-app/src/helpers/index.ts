import { DirStructure, DirType } from "../interfaces";
import logger from "./logger";
import detect from "detect-port";
import { shell } from "electron";
import * as fs from "fs-extra";
import * as path from "path";

/**
 * Sync Copy File
 * @param {string} source: path to the file that want to be copied
 * @param {string} target: path to the file want to be copied to. If target is a directory, then a file will be created under target directory.
 *
 * @returns {boolean}: true means copy successfully, false means copy failed
 */
export function copyFileSync(source: string, target: string): boolean {
  try {
    logger.functionStart("copyFileSync");
    logger.debug("source: ", source);
    logger.debug("target: ", target);

    let targetFile = target;
    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
      // when target is a directory
      if (fs.lstatSync(target).isDirectory()) {
        targetFile = path.join(target, path.basename(source));
        logger.debug(
          "*target* is a directory, will create a file under *target* directory. new *target*: ",
          targetFile
        );
      }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
    logger.functionEnd("copyFileSync");
    return true;
  } catch (err) {
    logger.error("copyFileSync error: ", err);
    return false;
  }
}

export function copyFolderRecursiveSync(
  source: string,
  target: string,
  cleanFolder?: boolean
): boolean {
  try {
    logger.functionStart("copyFolderRecursiveSync");
    logger.debug("source: ", source);
    logger.debug("target: ", target);

    // if source is directory
    if (fs.lstatSync(source).isDirectory()) {
      let files: Array<string> = [];
      //check if folder needs to be created or integrated
      const targetFolder = path.join(target, path.basename(source));
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
        logger.debug(
          "*target* directory doesn't, create *target* directory - ",
          targetFolder
        );
      } else {
        // if need to clean target folder
        if (cleanFolder) {
          fs.removeSync(targetFolder);
          fs.mkdirSync(targetFolder);
          logger.debug(
            `Clean and create *target(${targetFolder})* directory successful`
          );
        }
      }
      files = fs.readdirSync(source);
      files.forEach(function (file) {
        const curSource = path.join(source, file);
        if (fs.lstatSync(curSource).isDirectory()) {
          copyFolderRecursiveSync(curSource, targetFolder);
        } else {
          copyFileSync(curSource, targetFolder);
        }
      });
    } else {
      // if not a directory, then it is a file, so direct copy file
      copyFileSync(source, target);
      logger.debug(
        "*source* is a file, not a directory, so directly copy source file to target"
      );
    }

    logger.functionEnd("copyFolderRecursiveSync");
    return true;
  } catch (err) {
    logger.error("copyFolderRecursiveSync error: ", err);
    return false;
  }
}

/**
 * Recursive read a folder and return structure like:
 * [
      {
        type: 'file',
        name: 'package.json',
        path: 'package.json',
      },
      {
        type: 'directory',
        name: 'src',
        path: 'src'
        children: [
          {
            type: 'file',
            name: 'app.js',
            path: 'src/app.js'
          }
        ]
      }
    ]
 * @param source 
 */
export function readFolderRecursiveSync(source: string, currentPath = ".") {
  try {
    logger.debug("source: ", source);
    const folderData: Array<DirStructure> = [];
    // if source is directory
    if (fs.lstatSync(source).isDirectory()) {
      const folderContents = fs.readdirSync(source) || [];
      for (let i = 0; i < folderContents.length; i++) {
        const item = folderContents[i];
        if (fs.lstatSync(path.join(source, item)).isDirectory()) {
          const dirInfo: DirStructure = {
            type: DirType.directory,
            name: item,
            path: path.join(currentPath, item),
            children: readFolderRecursiveSync(
              path.join(source, item),
              path.join(currentPath, item)
            ),
          };

          folderData.push(dirInfo);
        } else if (fs.lstatSync(path.join(source, item)).isFile()) {
          const fileInfo: DirStructure = {
            type: DirType.file,
            name: item,
            path: path.join(currentPath, item),
          };
          folderData.push(fileInfo);
        } else {
          logger.warn(
            `readFolderRecursiveSync, unsupport type ${item}, skip this item`
          );
        }
      }
    }
    return folderData;
  } catch (err) {
    logger.error("readFolderRecursiveSync error: ", err);
    throw err;
  }
}

/**
 * Get an available port
 * @param port - specific port want to check whether it is available
 */
export async function getAvailablePort(port?: number): Promise<number> {
  return new Promise((resolve) => {
    if (!port) {
      port = 9090;
    }
    detect(port, (err: Error, port: number) => {
      if (err) {
        logger.error("getAvailablePort, error: ", err);
      }
      logger.debug(`${port} is available`);
      resolve(port);
    });
  });
}

export function openLinkExternal() {
  const hasATag = (node: any): any => {
    if (!node) {
      return {};
    }
    const tagName = node.tagName || "";
    if (tagName.toLowerCase() === "a") {
      const href = node.href;
      let target = node.target || "";
      target = target.toLowerCase();
      return {
        tagName,
        href,
        target,
      };
    } else {
      if (node.parentNode) {
        return hasATag(node.parentNode);
      } else {
        return {};
      }
    }
  };

  const body = document.querySelector("body");
  if (body) {
    body.addEventListener("click", (event) => {
      const aTag = hasATag(event && event.target);
      if (aTag.target === "_blank") {
        event.preventDefault();
        shell.openExternal(aTag.href);
      }
    });
  }
}

export function clear(moduleId: string) {
  if (typeof moduleId !== "string") {
    throw new TypeError(`Expected a \`string\`, got \`${typeof moduleId}\``);
  }
  delete require.cache[require.resolve(moduleId)];
}

export function clearRequireCacheStartWith(pathPrefix: string) {
  for (const moduleId of Object.keys(require.cache)) {
    if (moduleId.search(pathPrefix) != -1) {
      console.log("Need to clear: ", moduleId);
      clear(moduleId);
    }
  }
}
