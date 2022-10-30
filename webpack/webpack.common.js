const paths = require("./paths");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: [paths.entryFile],
    target: "node",
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
            }
        ]
    },
    externals: [nodeExternals()],
    resolve: {
        extensions: [".js", ".ts"]
    },
    output: {
        filename: "index.js",
        path: paths.dist,
    },
}
