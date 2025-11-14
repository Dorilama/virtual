import path from "node:path";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      "@dorilama/virtual-byos": path.resolve(__dirname, "../../../src"),
      "@dorilama/byos": path.resolve(__dirname, "../../../../byos/src"),
    },
  },
});
