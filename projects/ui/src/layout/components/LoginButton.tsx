/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

// import { Button, ButtonProps } from "@mui/material";

export function LoginButton(props: LoginButtonProps): JSX.Element {
  // const { method, onClick, linkTo, ...other } = props;

  return <button onClick={useHandleClick}>you login type</button>;
}

function useHandleClick() {
  console.log("click login");
}

export type LoginButtonProps = {};
