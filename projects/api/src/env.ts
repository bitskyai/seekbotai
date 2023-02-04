/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { cleanEnv, str, url } from "envalid";

/**
 * Ensures that all of the environment dependencies are met.
 *
 * @see https://github.com/af/envalid
 */
export default cleanEnv(process.env, {
    APP_NAME: str(),
    APP_ORIGIN: url(),
    APP_ENV: str({ choices: ["prod", "test", "local"] }),
    VERSION: str(),

    GOOGLE_CLOUD_PROJECT: str(),
    GOOGLE_CLOUD_REGION: str(),
    GOOGLE_CLOUD_ZONE: str(),
    GOOGLE_CLOUD_SQL_INSTANCE: str(),
    GOOGLE_APPLICATION_CREDENTIALS: str(),

    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),

    GA_MEASUREMENT_ID: str(),
});
