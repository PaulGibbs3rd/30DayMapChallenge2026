import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  publicDir: '../../public',
  plugins: [],
  server: {
    host: '127.0.0.1',
  },
  build: {
    outDir: "dist",
  },
});
