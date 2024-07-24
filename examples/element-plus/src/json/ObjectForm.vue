<script lang="ts" setup>
import { JsonFormStructJson, createJsonForm } from "@usaform/element-plus"
import { ElButton } from "element-plus"

const struct: JsonFormStructJson[] = [
    { type: "void", name: "title", element: "ElDividerLine", props: { contentPosition: "center", content: "基本表单元素" } },
    {
      type: "object",
      name: "group1",
      children: [
        { type: "plain", name: "input", layout: "FormItem", layoutProps: { label: "名称" }, element: "ElInput", props: { placeholder: "请输入名称" } },
        { type: "plain", name: "number", layout: "FormItem", layoutProps: { label: "数量" }, element: "ElInputNumber", props: { placeholder: "请输入数量" } },
        { type: "plain", name: "select", layout: "FormItem", layoutProps: { label: "下拉" }, element: "Select", props: { placeholder: "请选择" } }
      ]
    },
    { type: "plain", name: "radio", layout: "FormItem", layoutProps: { label: "按钮" }, element: "Radio" },
    {
      type: "object",
      name: "group2",
      children: [
        { type: "plain", name: "checkbox", layout: "FormItem", layoutProps: { label: "多选" }, element: "Checkbox" },
        { type: "plain", name: "DatePicker", layout: "FormItem", layoutProps: { label: "日期" }, element: "ElDatePicker", props: { type: "date", placeholder: "Pick a day" } },
        { type: "void", name: "title", element: "ElDividerLine", props: { contentPosition: "center", content: "(布局样式) 提交" } }
      ]
    },
    { type: "void", name: "actions", element: "submit" }
  ]
const [Form, FormRef] = createJsonForm({ struct })
const _getFormData = () => console.log(FormRef.value!.getFormData())
</script>

<template>
  <Form ref="FomrRef">
    <template #submit>
      <ElButton type="primary" @click="_getFormData">submit</ElButton>
      <ElButton @click="() => FormRef?.validate()">validate</ElButton>
      <ElButton @click="() => FormRef?.reset()">reset</ElButton>
    </template>
  </Form>
</template>
