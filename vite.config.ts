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


import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
