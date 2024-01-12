import vue from "@vitejs/plugin-vue"
import jsx from "@vitejs/plugin-vue-jsx"
import { defineConfig } from "vitest/config"

const args = process.argv.slice(2)
if (args.length === 0) throw "请输出测试的文件夹名称"

export default defineConfig({
  define: {
    __VUE_OPTIONS_API__: "false"
  },
  plugins: [vue(), jsx()],
  test: {
    include: args.map(s => `packages/${s}/**/*.spec.ts`),
    globals: true,
    environment: "jsdom",
    restoreMocks: true
  }
})
