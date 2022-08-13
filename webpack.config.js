/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/js/index.tsx",
  output: {
    // eslint-disable-next-line no-undef
    path: path.resolve("."),
    filename: "extension.js",
    library: {
      type: "module",
    },
    // libraryExport: "",
    libraryTarget: "module",
  },
  experiments: {
    outputModule: true,
  },
  target: "web",
  externals: {
    "@blueprintjs/core": ["Blueprint", "Core"],
    "@blueprintjs/datetime": ["Blueprint", "DateTime"],
    "@blueprintjs/select": ["Blueprint", "Select"],
    "chrono-node": "ChronoNode",
    "crypto-js": "CryptoJS",
    "file-saver": "FileSaver",
    jszip: ["RoamLazy", "JSZip"],
    idb: "idb",
    marked: ["RoamLazy", "Marked"],
    "marked-react": ["RoamLazy", "MarkedReact"],
    nanoid: "Nanoid",
    react: "React",
    "react-dom": "ReactDOM",
    tslib: "TSLib",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  externalsType: "window",
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".js", ".tsx"],
  },
};
