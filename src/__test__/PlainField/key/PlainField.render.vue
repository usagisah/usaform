<script lang="ts" setup>
import { createForm, PlainField } from "@shoroi/form"
import { ElCheckbox, ElDatePicker, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioGroup, ElSelect } from "element-plus"
import Tag from "./components/Tag.vue"

const props = defineProps<{
  inputInitValue?: string
  inputErrorMessage?: string
  tagInitValue?: string[]
}>()

const [Form, formActions] = createForm({
  config: {
    Elements: { ElCheckbox, ElDatePicker, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioGroup, ElSelect, Tag }
  }
})
defineExpose({ actions: formActions })
</script>

<template>
  <Form>
    <PlainField
      key="input"
      element="ElInput"
      :initValue="props.inputInitValue"
      :props="{ class: 'input' }"
      :layoutProps="{ label: '文本输入', rules: [{ required: true, type: 'string', min: 1, message: props.inputErrorMessage ?? '该字段不能为空' }] }"
    />
    <PlainField key="tag" element="Tag" :initValue="props.tagInitValue" />
    <PlainField key="inputNumber" element="ElInputNumber" :props="{ class: 'inputNumber' }" :layoutProps="{ label: '数字输入' }" />
  </Form>
</template>
