import { defaultUser } from "./defaultUsers";
import { readFileSync } from "fs";
import { join } from "path";

export const reactDevLearn = {
  id: "09494ce3-83e6-4e1e-9e06-3da2098dd070",
  userId: defaultUser.id,
  title: "Quick Start – React",
  description: "The library for web and native user interfaces",
  url: "https://react.dev/learn",
  content: readFileSync(
    join(__dirname, "./files/react_dev_learn.txt"),
    "utf-8",
  ),
};

export const reactDevLearnPageMetadata = {
  id: "0b03abb9-0154-4413-893c-c3bb63a66947",
  userId: defaultUser.id,
  pageId: reactDevLearn.id,
};

export const reactDevTicTacToe = {
  id: "acba1ed9-1553-4b87-8f61-7edc39b924f6",
  userId: defaultUser.id,
  title: "Tutorial: Tic-Tac-Toe – React",
  description: "The library for web and native user interfaces",
  url: "https://react.dev/learn/tutorial-tic-tac-toe",
  content: readFileSync(
    join(__dirname, "./files/react_dev_tic_tac_toe.txt"),
    "utf-8",
  ),
};

export const reactDevTicTacToePageMetadata = {
  id: "91ab9e74-a6f7-4586-a0bf-d8519bdb30df",
  userId: defaultUser.id,
  pageId: reactDevTicTacToe.id,
};

export const reactDevThinkingInReact = {
  id: "779b49eb-bb92-4467-b81f-74ae7ec1e135",
  userId: defaultUser.id,
  title: "Thinking in React – React",
  description: "The library for web and native user interfaces",
  url: "https://react.dev/learn/thinking-in-react",
  content: readFileSync(
    join(__dirname, "./files/react_dev_thinking_in_react.txt"),
    "utf-8",
  ),
};

export const reactDevThinkingInReactPageMetadata = {
  id: "857b6a27-64e3-4915-8895-f34e5dfe6b8b",
  userId: defaultUser.id,
  pageId: reactDevThinkingInReact.id,
};

export default [reactDevLearn, reactDevTicTacToe, reactDevThinkingInReact];
export const pageMetadata = [
  reactDevLearnPageMetadata,
  reactDevTicTacToePageMetadata,
  reactDevThinkingInReactPageMetadata,
];
