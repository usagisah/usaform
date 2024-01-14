import { FormItem, useFormConfigProvide } from "@usaform/element-plus"
import "@usaform/element-plus/style.scss"
import { ElCascader, ElDatePicker, ElInput, ElInputNumber, ElSelect } from "element-plus"
import "element-plus/dist/index.css"
import { createApp } from "vue"

import ArraySlot from "./array/Array.slot.vue"
import Checkbox from "./basic/Checkbox.vue"
import Radio from "./basic/Radio.vue"
import Select from "./basic/Select.vue"
import DynamicGroup from "./dynamic/DynamicNest.Group.vue"
import DynamicItem from "./dynamic/DynamicNest.Item.vue"
import DynamicOperate from "./dynamic/DynamicNest.Operate.vue"
import DynamicType from "./dynamic/DynamicNest.Type.vue"
import DynamicValue from "./dynamic/DynamicNest.Value.vue"

import Layout from "./Layout.vue"
const app = createApp(Layout)
useFormConfigProvide(
  {
    Elements: {
      ElInput,
      ElSelect,
      FormItem,
      ElInputNumber,
      Select,
      Radio,
      Checkbox,
      ElDatePicker,
      ElCascader,
      ArraySlot,
      DynamicGroup,
      DynamicItem,
      DynamicType,
      DynamicOperate,
      DynamicValue
    }
  },
  app
)
app.mount("#app")
