<script lang="ts" setup>
import { createForm, PlainField } from "@shoroi/form"
import { ElButton, ElCard, ElInput, ElSpace } from "element-plus"
import { reactive, shallowRef } from "vue"

const disabled = shallowRef(false)
const [Form] = createForm({
  config: {
    layoutProps: reactive({ disabled })
  }
})
</script>

<template>
  <ElCard style="margin: 0 auto; width: 45%">
    <Form>
      <PlainField key="a" :layoutProps="{ label: '跟随全局禁用' }">
        <template #default="{ bind, ...p }">
          <ElInput v-bind="bind" />
        </template>
      </PlainField>

      <PlainField key="b" :layout-props="{ label: '跟随全局禁用' }">
        <template #default="{ bind }">
          <ElInput v-bind="bind" />
        </template>
      </PlainField>

      <PlainField key="c" :layout-props="{ label: '跟随全局禁用' }">
        <template #default="{ bind }">
          <ElInput v-bind="bind" />
        </template>
      </PlainField>
    </Form>

    <ElSpace>
      <ElButton @click="disabled = !disabled">切换禁用状态-{{ disabled }}</ElButton>
    </ElSpace>
  </ElCard>
</template>
