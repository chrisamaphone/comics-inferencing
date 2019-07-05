const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        activity: path.join(__dirname, "src", "main.ts")
    },
    output: {
        filename: path.join("lib", "js.js"),
        path: path.resolve(__dirname, "lib")
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    module: {
        rules: [ { test: /\.tsx?$/, loader: "ts-loader" } ]
    }
}
