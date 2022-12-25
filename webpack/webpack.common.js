const paths = require("./paths");
const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

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
            {
                test: /\.eta$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name]-[hash].[ext]",
                            outputPath: "eta-templates",
                            publicPath: "dist/eta-templates",
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ESLintPlugin({
            fix: true,
        }),
    ],
    externals: [nodeExternals()], // 排除 node_modules 目录中所有模块
    resolve: {
        extensions: [".js", ".ts"],
    },
    output: {
        filename: "index.js",
        path: paths.dist,
    },
};
