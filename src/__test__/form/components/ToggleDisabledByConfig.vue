<script lang="ts" setup>
import { createForm, PlainField } from "@shoroi/form"
import { ElInput } from "element-plus"
import { nextTick, reactive, shallowRef } from "vue"

const disabled = shallowRef(false)
const [Form, actions] = createForm({
  config: {
    layoutProps: reactive({ disabled })
  }
})

defineExpose({
  actions,
  setDisabled(value: boolean) {
    disabled.value = value
    return nextTick()
  }
})
</script>

<template>
  <Form>
    <PlainField key="a">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>

    <PlainField key="b">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>

    <PlainField key="c">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>
  </Form>
</template>
