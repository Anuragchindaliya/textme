import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["eslint-plugin-prettier"], // Include the ESLint Prettier plugin
  },
  server: {
    // open: true,
    hmr: {
      overlay: false, // Disabling the overlay ensures ESLint errors are shown in the console
    },
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    "process.env.IS_PREACT": JSON.stringify("true"),
  },
})
