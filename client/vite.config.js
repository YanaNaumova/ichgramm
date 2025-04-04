import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // прослушивание всех интерфейсов
    port: 3001,
    base: "/ichgramm/",
  },
  plugins: [react()],
});
