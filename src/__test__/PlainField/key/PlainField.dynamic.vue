<script lang="ts" setup>
import { createForm, PlainField } from "@shoroi/form"
import { ElInput } from "element-plus"
import { nextTick, ref } from "vue"

const [Form, formActions] = createForm({
  config: {
    Elements: { ElInput }
  }
})
const conditionKeys = ref(["f1", "f2", "f3"])
defineExpose({
  actions: formActions,
  setConditionKeys(keys: string[]) {
    conditionKeys.value = keys
    return nextTick().then(() => formActions.value.getFormData())
  }
})
</script>

<template>
  <Form>
    <PlainField key="f1" element="ElInput" :props="{ class: 'f1' }" v-if="conditionKeys.includes('f1')" />
    <PlainField key="f2" element="ElInput" :props="{ class: 'f2' }" v-if="conditionKeys.includes('f2')" />
    <PlainField key="f3" element="ElInput" :props="{ class: 'f3' }" v-if="conditionKeys.includes('f3')" />
  </Form>
</template>
