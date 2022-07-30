const { defineConfig } = require("vite");
const { resolve } = require("path");

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/js/index.ts"),
      name: "roamist",
      filename: (format) => `roamist.${format}.js`,
    },
  },
  resolve: {
    alias: {
      "aws-sdk": "aws-sdk/dist/aws-sdk.min.js",
    },
  },
});
