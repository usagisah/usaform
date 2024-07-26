<script lang="ts" setup>
import { JsonFormStructJson, createJsonForm } from "@shoroi/form"
import { ElButton } from "element-plus"

const struct: JsonFormStructJson[] = [
  { type: "void", name: "title", element: "ElDividerLine", props: { contentPosition: "center", content: "基本表单元素" } },
  {
    type: "plain",
    name: "input",
    layout: "FormItem",
    layoutProps: { label: "名称" },
    element: "ElInput",
    props: { placeholder: "请输入名称" }
  },
  {
    type: "ary",
    name: "ary",
    children: [
      {
        type: "object",
        name: "",
        children: [
          {
            type: "plain",
            name: "input",
            layout: "FormItem",
            layoutProps: { label: "名称" },
            element: "ElInput",
            props: { placeholder: "请输入名称" }
          }
        ]
      }
    ]
  },
  { type: "void", name: "actions", element: "submit" }
]

const [Form, FormRef] = createJsonForm({
  struct,
  config: {
    defaultFormData: {
      input: "outside default input",
      ary: [
        { key: 1, value: { input: "inner default input1" } },
        { key: 2, value: { input: "inner default input2" } }
      ]
    }
  }
})
const _getFormData = () => console.log(FormRef.value!.getFormData())
const push = () => {
  FormRef.value!.set("ary", { key: Math.random(), input: Math.random() }, "push")
}
</script>

<template>
  <Form>
    <template #submit>
      <ElButton type="primary" @click="_getFormData">submit</ElButton>
      <ElButton @click="() => FormRef?.validate()">validate</ElButton>
      <ElButton @click="() => FormRef?.reset()">reset</ElButton>
      <ElButton @click="push">尾部添加</ElButton>
    </template>
  </Form>
</template>
