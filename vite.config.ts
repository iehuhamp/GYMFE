import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
  base: "./", // Dùng "./" nếu deploy trên custom domain hoặc thư mục con
  build: {
    outDir: "dist",
  },
});
