/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

export type EnvName = "prod" | "test" | "local";
export type Config = {
  app: {
    env: EnvName;
    name: string;
    origin: string;
    hostname: string;
  };
};
export const config: Config = {
  app: {
    env: "local",
    name: "BitSky",
    origin: "http://localhost:5173",
    hostname: "localhost",
  },
};
