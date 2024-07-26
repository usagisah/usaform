import vue from "@vitejs/plugin-vue"
import jsx from "@vitejs/plugin-vue-jsx"
import { resolve } from "path"
import { defineConfig } from "vite"
import inspect from "vite-plugin-inspect"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [inspect(), vue(), jsx()],
  resolve: {
    alias: {
      "@shoroi/form": resolve(process.cwd(), "../../dist/index.js"),
      "@style/element-plus": resolve(process.cwd(), "../../style/element-plus.scss")
    }
  }
})
