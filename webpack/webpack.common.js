const paths = require("./paths");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: [paths.entryFile],
    target: "node", // 排除诸如path、fs等内置模块。
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    externals: [nodeExternals()], // 排除 node_modules 目录中所有模块
    resolve: {
        extensions: [".js", ".ts"],
    },
    output: {
        filename: "index.js",
        path: paths.dist,
    },
};
