<script lang="ts" setup>
import { ref } from "vue"
import { ElInput, ElSelect, ElInputNumber, ElDivider, ElCard, ElButton, ElDatePicker, ElCascader } from "element-plus"
import { Form, FormConfig, FormItem, PlainField, FormExpose } from "@usaform/element-plus"
import Select from "./form/Select.vue"
import Radio from "./form/Radio.vue"
import Checkbox from "./form/Checkbox.vue"

const CascaderOptions = [
  {
    value: "guide",
    label: "Guide",
    children: [
      {
        value: "disciplines",
        label: "Disciplines",
        children: [
          {
            value: "consistency",
            label: "Consistency"
          },
          {
            value: "feedback",
            label: "Feedback"
          },
          {
            value: "efficiency",
            label: "Efficiency"
          },
          {
            value: "controllability",
            label: "Controllability"
          }
        ]
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          {
            value: "side nav",
            label: "Side Navigation"
          },
          {
            value: "top nav",
            label: "Top Navigation"
          }
        ]
      }
    ]
  },
  {
    value: "component",
    label: "Component",
    children: [
      {
        value: "basic",
        label: "Basic",
        children: [
          {
            value: "layout",
            label: "Layout"
          },
          {
            value: "color",
            label: "Color"
          },
          {
            value: "typography",
            label: "Typography"
          },
          {
            value: "icon",
            label: "Icon"
          },
          {
            value: "button",
            label: "Button"
          }
        ]
      },
      {
        value: "form",
        label: "Form",
        children: [
          {
            value: "radio",
            label: "Radio"
          },
          {
            value: "checkbox",
            label: "Checkbox"
          },
          {
            value: "input",
            label: "Input"
          },
          {
            value: "input-number",
            label: "InputNumber"
          },
          {
            value: "select",
            label: "Select"
          },
          {
            value: "cascader",
            label: "Cascader"
          },
          {
            value: "switch",
            label: "Switch"
          },
          {
            value: "slider",
            label: "Slider"
          },
          {
            value: "time-picker",
            label: "TimePicker"
          },
          {
            value: "date-picker",
            label: "DatePicker"
          },
          {
            value: "datetime-picker",
            label: "DateTimePicker"
          },
          {
            value: "upload",
            label: "Upload"
          },
          {
            value: "rate",
            label: "Rate"
          },
          {
            value: "form",
            label: "Form"
          }
        ]
      },
      {
        value: "data",
        label: "Data",
        children: [
          {
            value: "table",
            label: "Table"
          },
          {
            value: "tag",
            label: "Tag"
          },
          {
            value: "progress",
            label: "Progress"
          },
          {
            value: "tree",
            label: "Tree"
          },
          {
            value: "pagination",
            label: "Pagination"
          },
          {
            value: "badge",
            label: "Badge"
          }
        ]
      },
      {
        value: "notice",
        label: "Notice",
        children: [
          {
            value: "alert",
            label: "Alert"
          },
          {
            value: "loading",
            label: "Loading"
          },
          {
            value: "message",
            label: "Message"
          },
          {
            value: "message-box",
            label: "MessageBox"
          },
          {
            value: "notification",
            label: "Notification"
          }
        ]
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          {
            value: "menu",
            label: "Menu"
          },
          {
            value: "tabs",
            label: "Tabs"
          },
          {
            value: "breadcrumb",
            label: "Breadcrumb"
          },
          {
            value: "dropdown",
            label: "Dropdown"
          },
          {
            value: "steps",
            label: "Steps"
          }
        ]
      },
      {
        value: "others",
        label: "Others",
        children: [
          {
            value: "dialog",
            label: "Dialog"
          },
          {
            value: "tooltip",
            label: "Tooltip"
          },
          {
            value: "popover",
            label: "Popover"
          },
          {
            value: "card",
            label: "Card"
          },
          {
            value: "carousel",
            label: "Carousel"
          },
          {
            value: "collapse",
            label: "Collapse"
          }
        ]
      }
    ]
  },
  {
    value: "resource",
    label: "Resource",
    children: [
      {
        value: "axure",
        label: "Axure Components"
      },
      {
        value: "sketch",
        label: "Sketch Templates"
      },
      {
        value: "docs",
        label: "Design Documentation"
      }
    ]
  }
]

const formConfig: FormConfig = {
  Elements: { ElInput, ElSelect, FormItem, ElInputNumber, Select, Radio, Checkbox, ElDatePicker, ElCascader }
}
const form = ref<FormExpose | null>(null)
const print = () => {
  console.log(form.value!.getFormData())
}
const validate = async () => {
  console.log(await form.value!.validate())
}
const reset = () => {
  form.value!.reset()
}
</script>

<template>
  <div class="form">
<ElCard>
  <Form :config="formConfig" ref="form">
    <ElDivider content-position="center">(布局样式) 基本表单元素</ElDivider>
    <PlainField name="input" layout="FormItem" :layout-props="{ label: '名称', required: true }" element="ElInput" :props="{ placeholder: '请输入名称' }" />
    <PlainField name="number" layout="FormItem" :layout-props="{ label: '数量' }" element="ElInputNumber" :props="{ placeholder: '请输入数量' }" />
    <PlainField name="select" layout="FormItem" :layout-props="{ label: '下拉' }" element="Select" :props="{ placeholder: '请选择' }" />
    <PlainField name="radio" layout="FormItem" :layout-props="{ label: '按钮' }" element="Radio" />
    <PlainField name="Cascader" layout="FormItem" :layout-props="{ label: '级联' }" element="ElCascader" :props="{ options: CascaderOptions, props: { expandTrigger: 'hover' } }" />
    <PlainField name="Checkbox" layout="FormItem" :layout-props="{ label: '多选' }" element="Checkbox" />
    <PlainField name="DatePicker" layout="FormItem" :layout-props="{ label: '时间' }" element="ElDatePicker" :props="{ type: 'date', placeholder: 'Pick a day' }" />

    <ElDivider content-position="center">(布局样式) 提交</ElDivider>
    <FormItem>
      <ElButton @click="print">submit</ElButton>
      <ElButton @click="validate">validate</ElButton>
      <ElButton type="danger" @click="reset">reset</ElButton>
    </FormItem>
  </Form>
</ElCard>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  .el-card {
    width: 800px;
  }
}
</style>
