import { MakerDeb } from "@electron-forge/maker-deb";
// import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import type { ForgeConfig } from "@electron-forge/shared-types";
import path from "path";

const config: ForgeConfig = {
  packagerConfig: {
    name: "seekbot",
    executableName: "seekbot",
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
      /^\/tsconfig-ui\.json/,
      /^\/tsconfig.node\.json/,
      /^\/README\.md/,
      /^\/\.env.prod.template/,
      /^\/\.yarn/,
      /^\/yarn\.lock/,
      /^\/package-lock\.json/,
      /^\/LICENSE/,
      /^\/vite\.config\.ts/,
      /^\/playwright\.config\.ts/,
    ],
    osxSign: {},
    osxNotarize: {
      appleId: `${process.env.APPLE_ID}`,
      appleIdPassword: `${process.env.APPLE_ID_PASSWORD}`,
      teamId: `${process.env.APPLE_TEAM_ID}`,
      // appleApiKey: process.env.APPLE_API_KEY_PATH,
      // appleApiIssuer: process.env.APPLE_API_KEY_ID,
      // appleApiKeyId: process.env.APPLE_API_ISSUER,
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    // new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
    new MakerDMG({
      name: "SeekBot",
      format: "ULFO",
      background: path.resolve(__dirname, "assets", "background.png"),
      icon: path.resolve(__dirname, "assets", "icons", "bitsky128.png"),
      iconSize: 128,
    }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "seekbotai",
          name: "seekbot",
        },
        draft: true,
        prerelease: true,
      },
    },
  ],
};

export default config;
