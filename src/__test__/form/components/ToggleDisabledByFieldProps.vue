<script lang="ts" setup>
import { createForm, PlainField } from "@shoroi/form"
import { ElInput } from "element-plus"
import { nextTick, shallowRef } from "vue"

const disabled = shallowRef(false)
const [Form] = createForm()
defineExpose({
  setDisabled: (b: boolean) => {
    disabled.value = b
    return nextTick()
  }
})
</script>

<template>
  <Form>
    <PlainField key="a" :layoutProps="{ disabled }">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>

    <PlainField key="b" :layout-props="{ disabled }">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>

    <PlainField key="c" :layout-props="{ disabled }">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>
  </Form>
</template>
