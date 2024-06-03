import vue from "@vitejs/plugin-vue"
import jsx from "@vitejs/plugin-vue-jsx"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), jsx()]
})
