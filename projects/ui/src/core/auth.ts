/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { atom, useRecoilValueLoadable } from "recoil";

export const SignInMethods = ["google.com", "apple.com", "anonymous"];

export const CurrentUser = atom({
  key: "CurrentUser",
  dangerouslyAllowMutability: true,
  effects: [
    (ctx) => {
      if (ctx.trigger === "get") {
        console.log("CurrentUser");
      }
    },
  ],
});

/**
 * The currently logged-in (authenticated) user object.
 *
 * @example
 *   const { useCurrentUser } from "../core/auth.js";
 *
 *   function Example(): JSX.Element {
 *     const me = useCurrentUser();
 *     // => { uid: "xxx", email: "me@example.com", ... }
 *     // => Or, `null` when not authenticated
 *     // => Or, `undefined` when not initialized
 *   }
 */
export function useCurrentUser() {
  const value = useRecoilValueLoadable(CurrentUser);
  return value.state === "loading" ? undefined : value.valueOrThrow();
}

export function useSignIn() {
  return React.useCallback(async function () {
    console.log("open sign in dialog");
  }, []);
}

export function useSignOut() {
  return React.useCallback(() => console.log("open sign out dialog"), []);
}

export {};
