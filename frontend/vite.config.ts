import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router") || id.includes("react-dom")) return "vendor-react";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("axios")) return "vendor-axios";
          }
          if (id.includes("/src/pages/admin/") || id.includes("/src/components/admin/")) {
            return "admin";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
});