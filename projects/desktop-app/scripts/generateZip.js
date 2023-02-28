/* eslint-disable @typescript-eslint/no-var-requires */
const zip = require("cross-zip");
const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

let files = glob.globSync(path.join(__dirname, "../out/make/**/*.zip")) || [];
if (!files.length) {
  files = glob.globSync(path.join(__dirname, "../out/make/**/*.deb")) || [];
  files = files.concat(
    glob.globSync(path.join(__dirname, "../out/make/**/*.exe")) || []
  );
  files = files.concat(
    glob.globSync(path.join(__dirname, "../out/make/**/*.nupkg")) || []
  );
  files = files.concat(
    glob.globSync(path.join(__dirname, "../out/make/**/*.rpm")) || []
  );
  files.forEach((file) => {
    fs.copySync(
      file,
      path.join(__dirname, "../out/installer", path.basename(file))
    );
  });
  // then make the whole make folder as a zip
  zip.zipSync(
    path.join(__dirname, "../out/installer"),
    path.join(__dirname, "../out/bi.zip")
  );
} else {
  files.forEach((file) => {
    fs.copySync(file, path.join(__dirname, "../out/bi.zip"));
  });
}
