import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: "buffer/", // Note the trailing slash
      events: "events/",
    },
  },
  build: {
    rollupOptions: {
      external: ["buffer", "events"],
    },
  },
});
