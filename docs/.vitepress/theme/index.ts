// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
import { h } from "vue"
import "./style.css"

import { CFormPlugin } from "@shoroi/form"
import "@shoroi/form/style/element-plus"
import { ElCheckbox, ElDatePicker, ElInput, ElInputNumber, ElRadioGroup, ElSelect } from "element-plus"
import "element-plus/dist/index.css"

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.use(CFormPlugin, {
      Elements: {
        ElInput,
        ElSelect,
        ElInputNumber,
        ElRadioGroup,
        ElCheckbox,
        ElDatePicker
      }
    })
  }
} satisfies Theme
