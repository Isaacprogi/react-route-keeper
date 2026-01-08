import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
    }),
    dts({
      insertTypesEntry: true,
    }),
    libInjectCss(),
  ],

  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "RouteKeeper",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ["react", "react-dom", "react-router-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM",
        },
        assetFileNames: "style.css",
      },
    },

    // ← ADD THIS TO KEEP CONSOLE LOGS
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,  // Keep console.log/warn/error
      },
      format: {
        comments: false, // Optional: remove comments too if you want
      },
    },
  },
});
