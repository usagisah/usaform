import { CFormPlugin } from "@shoroi/form"
import "@style/element-plus"
import { ElCheckbox, ElDatePicker, ElInput, ElInputNumber, ElRadioGroup, ElSelect } from "element-plus"
import "element-plus/dist/index.css"
import { createApp } from "vue"
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"

export const routes: RouteRecordRaw[] = []
const mods = import.meta.glob("./demos/*/*.vue")
for (const k in mods) {
  const v = mods[k]
  routes.push({ path: "/" + k.split("/").slice(2, 4).join("/").slice(0, -4), component: v })
}
const app = createApp(App)
  .use(createRouter({ history: createWebHistory(), routes }))
  .use(CFormPlugin, {
    Elements: {
      ElInput,
      ElSelect,
      ElInputNumber,
      ElRadioGroup,
      ElCheckbox,
      ElDatePicker
    }
  })
app.mount("#app")
