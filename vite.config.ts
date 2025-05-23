import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/Expense-Tracker/",
  test: {
    ...configDefaults,
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: {
      host: 'pathumdilshan.run.place',
      port: 4000,
      protocol: 'ws',
    },
  },
  preview: {
    port: 4000,
    host: true,
  },
})
