import { resolve } from "path";

import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";
import { viteExternalsPlugin } from "vite-plugin-externals";

export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [
    viteExternalsPlugin({
      react: "React",
      "react-dom": "ReactDOM",
    }),
  ],
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
