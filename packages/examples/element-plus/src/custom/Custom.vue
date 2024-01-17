<script lang="ts" setup>
import { CFormConfig, CFormExpose, Form, PlainField } from "@usaform/element-plus"
import { ref } from "vue"
import CustomElement from "./CustomElement.vue"
import CustomLayout from "./CustomLayout.vue"
import { ElButton, ElSpace } from "element-plus"

const config: CFormConfig = {
  Elements: { CustomElement, CustomLayout }
}
const form = ref<CFormExpose>()
const layoutIncrease = () => {
  form.value!.callLayout("increase", null)
}
const elementIncrease = () => {
  form.value!.callElement("increase", null)
}
</script>

<template>
  <Form ref="form" :config="config">
    <PlainField name="input" layout="CustomLayout" element="CustomElement"></PlainField>
  </Form>
  <ElSpace>
    <ElButton @click="layoutIncrease">调用自定义布局方法 +1</ElButton>
    <ElButton @click="elementIncrease">调用自定义字段方法 +1</ElButton>
  </ElSpace>
</template>

<style lang="scss" scoped></style>
