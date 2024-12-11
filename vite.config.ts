import vue from "@vitejs/plugin-vue"
import jsx from "@vitejs/plugin-vue-jsx"
import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [vue(), jsx()],
  resolve: {
    alias: {
      "@shoroi/form": path.resolve(process.cwd(), "src/index.ts")
    }
  },
  test: {
    include: ["src/__test__/**/*.{test,spec}.ts"],
    globals: true,
    environment: "jsdom"
  }
})
