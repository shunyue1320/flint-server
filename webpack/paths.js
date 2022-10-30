const path = require("path");

const resolvePath = (...relativePath) => path.resolve(__dirname, "..", ...relativePath);

module.exports = {
    dist: resolvePath("dist"),
    entryFile: resolvePath("src", "index.ts")
}
