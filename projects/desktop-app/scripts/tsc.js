/* eslint-disable @typescript-eslint/no-var-requires */

const { run } = require("./run-bin");

async function compileTypeScript() {
  if (process.env.WATCH) {
    await run("TypeScript", "tsc", ["-p", "tsconfig.json", "-w"]);
  } else {
    await run("TypeScript", "tsc", ["-p", "tsconfig.json"]);
  }
}

module.exports = {
  compileTypeScript,
};

if (require.main === module) compileTypeScript();
