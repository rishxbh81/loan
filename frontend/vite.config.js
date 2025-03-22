import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Set the development server port
    watch: {
      usePolling: true, // Enables polling for environments with limited file watching
    },
  },
});
