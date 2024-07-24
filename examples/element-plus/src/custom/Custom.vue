<script lang="ts" setup>
import { createForm, PlainField } from "@usaform/element-plus"
import CustomElement from "./CustomElement.vue"
import CustomLayout from "./CustomLayout.vue"
import { ElButton, ElSpace } from "element-plus"

const [Form, form] = createForm({ config: { Elements: { CustomElement, CustomLayout } } })
const layoutIncrease = () => {
  form.value!.callLayout("all", "increase")
}
const elementIncrease = () => {
  form.value!.callElement("all", "increase")
}
</script>

<template>
  <Form>
    <PlainField name="input" layout="CustomLayout" element="CustomElement"></PlainField>
  </Form>
  <ElSpace>
    <ElButton @click="layoutIncrease">调用自定义布局方法 +1</ElButton>
    <ElButton @click="elementIncrease">调用自定义字段方法 +1</ElButton>
  </ElSpace>
</template>
