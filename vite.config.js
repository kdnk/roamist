const { defineConfig } = require("vite");
const { resolve } = require("path");

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/js/index.ts"),
      name: "extension",
      fileName: (_format) => "extension.js",
      formats: ["umd"],
    },
    outDir: ".",
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "style.css") {
            return "extension.css";
          }
          return assetInfo.name;
        },
      },
    },
  },
  resolve: {
    alias: {
      "aws-sdk": "aws-sdk/dist/aws-sdk.min.js",
    },
  },
});
