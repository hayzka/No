import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), ViteSingleFile()],
  build: {
    assetsInlineLimit: 100000000, // agar semua assets di-inline ke HTML
    cssCodeSplit: false           // supaya semua CSS ikut di index.html
  }
});
