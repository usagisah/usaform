import { CFormPlugin, FormItem } from "@shoroi/form"
import "@shoroi/form/style/ant-design.scss"
import { Checkbox, Input, InputNumber, Radio, Select } from "ant-design-vue"
import { createApp } from "vue"
import Layout from "./Layout.vue"

const app = createApp(Layout).use(CFormPlugin, {
  Elements: {
    FormItem,
    Input,
    Select,
    InputNumber,
    Radio,
    Checkbox
  },
  modelValue: "value"
})
app.mount("#app")
