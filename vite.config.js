import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodeResolve from "@rollup/plugin-node-resolve";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodeResolve({
      extensions: [".js", ".jsx", ".json"], // Add other extensions you need
    }),
  ],
});
