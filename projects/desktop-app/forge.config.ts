import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
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
    osxSign: {
      optionsForFile() {
        return {
          entitlements: path.resolve(__dirname, "entitlements.plist"),
        };
      },
    },
    osxNotarize: {
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    },
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
