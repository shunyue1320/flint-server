const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    optimization: {
        minimize: false, // 不压缩打包后的 bundle 文件
        moduleIds: "named", // 告诉 webpack 使用文件路径的 name 值来作为 module 的 id
    },
});
