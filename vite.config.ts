
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: parseInt(env.SERVER_PORT || '8080'),
    },
    plugins: [
      react(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return;
            }

            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("/react-router-dom/") ||
              id.includes("/scheduler/")
            ) {
              return "react-vendor";
            }

            if (
              id.includes("/@supabase/") ||
              id.includes("/@tanstack/")
            ) {
              return "data-vendor";
            }

            if (
              id.includes("/recharts/") ||
              id.includes("/d3-")
            ) {
              return "charts-vendor";
            }

            if (
              id.includes("/react-day-picker/") ||
              id.includes("/date-fns/")
            ) {
              return "date-vendor";
            }

            if (
              id.includes("/@radix-ui/") ||
              id.includes("/lucide-react/") ||
              id.includes("/cmdk/") ||
              id.includes("/embla-carousel-react/") ||
              id.includes("/sonner/") ||
              id.includes("/vaul/")
            ) {
              return "ui-vendor";
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
  };
});
