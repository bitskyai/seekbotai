import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import path from "path";
// import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import type { ForgeConfig } from "@electron-forge/shared-types";

// import { mainConfig } from "./webpack.main.config";
// import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    name: "bi",
    executableName: "bi",
    icon: path.resolve(__dirname, "assets", "icons", "bitsky"),
    ignore: [
      /^\/\.vscode/,
      /^\/scripts/,
      /^\/src/,
      /^\/node_modules/,
      /^\/forge\.config\.ts/,
      /^\/yarn-error\.log/,
      /^\/\.gitignore/,
      /^\/\.eslintrc\.json/,
      /^\/tsconfig\.json/,
      /^\/README\.md/,
      /^\/yarn\.lock/,
      /^\/package-lock\.json/,
      /^\/LICENSE/,
      /^\/webpack\..*\.ts/,
    ],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "bitskyai",
          name: "bi",
        },
        draft: true,
        prerelease: true,
      },
    },
  ],
};

export default config;
