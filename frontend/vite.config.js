import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.BACKEND_URL || env.VITE_BACKEND_URL || process.env.BACKEND_URL || "http://127.0.0.1:8000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": { target, changeOrigin: true },
        "/admin": { target, changeOrigin: true },
        "/static": { target, changeOrigin: true },
        "/media": { target, changeOrigin: true },
        "/swagger": { target, changeOrigin: true },
        "/redoc": { target, changeOrigin: true },
      },
    },
  };
});

