import { resolve } from "path";

import { defineConfig } from "vite";
import env from "vite-plugin-env-compatible";

export default defineConfig({
  plugins: [env()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/js/index.tsx"),
      name: "extension",
      fileName: (_format) => "extension.js",
      formats: ["es"],
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
