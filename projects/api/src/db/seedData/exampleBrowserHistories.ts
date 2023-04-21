import { defaultUser } from "./defaultUsers";
import { readFileSync } from "fs";
import { join } from "path";

export const reactDevLearn = {
  id: 1,
  userId: defaultUser.id,
  name: "Quick Start – React",
  description: "The library for web and native user interfaces",
  url: "https://react.dev/learn",
  count: 0,
  content: readFileSync(
    join(__dirname, "./files/react_dev_learn.txt"),
    "utf-8",
  ),
};

export const reactDevTicTacToe = {
  id: 2,
  userId: defaultUser.id,
  name: "Tutorial: Tic-Tac-Toe – React",
  description: "The library for web and native user interfaces",
  url: "https://react.dev/learn/tutorial-tic-tac-toe",
  count: 0,
  content: readFileSync(
    join(__dirname, "./files/react_dev_tic_tac_toe.txt"),
    "utf-8",
  ),
};
export const reactDevThinkingInReact = {
  id: 3,
  userId: defaultUser.id,
  name: "Thinking in React – React",
  description: "The library for web and native user interfaces",
  url: "https://react.dev/learn/thinking-in-react",
  count: 0,
  content: readFileSync(
    join(__dirname, "./files/react_dev_thinking_in_react.txt"),
    "utf-8",
  ),
};
export default [reactDevLearn, reactDevTicTacToe, reactDevThinkingInReact];
