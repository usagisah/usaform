import { CFormPlugin } from "@shoroi/form"
import "@style/element-plus"
import { ElCascader, ElDatePicker, ElInput, ElInputNumber, ElSelect } from "element-plus"
import "element-plus/dist/index.css"
import { createApp } from "vue"

import Layout from "./Layout.vue"
import ArraySlot from "./array/Array.slot.vue"
import Checkbox from "./basic/Checkbox.vue"
import Radio from "./basic/Radio.vue"
import Select from "./basic/Select.vue"
import ElDividerLine from "./components/ElDividerLine.vue"
import DynamicGroup from "./dynamic/DynamicNest.Group.vue"
import DynamicItem from "./dynamic/DynamicNest.Item.vue"
import DynamicOperate from "./dynamic/DynamicNest.Operate.vue"
import DynamicType from "./dynamic/DynamicNest.Type.vue"
import DynamicValue from "./dynamic/DynamicNest.Value.vue"
const app = createApp(Layout).use(CFormPlugin, {
  Elements: {
    ElInput,
    ElSelect,
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
    DynamicValue,
    ElDividerLine
  }
})
app.mount("#app")
