import vue from "@vitejs/plugin-vue"
import jsx from "@vitejs/plugin-vue-jsx"
import { defineConfig } from "vite"
import inspect from "vite-plugin-inspect"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    inspect(),
    vue(),
    jsx()
    // AutoImport({
    //   resolvers: [ElementPlusResolver()]
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()]
    // })
  ]
})
