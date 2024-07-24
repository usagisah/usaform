<script lang="ts" setup>
import { shallowRef, reactive } from "vue"
import { createForm, PlainField } from "@usaform/element-plus"
import { ElButton, ElInput, ElSpace } from "element-plus"

const disabled = shallowRef(false)
const [Form, _, forceRender] = createForm({
  dynamic: true,
  config: {
    plainFieldController: "FormItem",
    layoutProps: reactive({ disabled })
  }
})
</script>

<template>
  <Form>
    <PlainField name="a" :layoutProps="{ label: '跟随全局禁用', disabled }">
      <template #default="{ bind, ...p }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>

    <PlainField name="b" :layout-props="{ label: '跟随全局禁用' }">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>

    <PlainField name="c" :layout-props="{ label: '跟随全局禁用' }">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>
  </Form>

  <ElSpace>
    <ElButton @click="disabled = !disabled">toggle-{{ disabled }}</ElButton>
    <ElButton @click="forceRender">强制刷新</ElButton>
  </ElSpace>
</template>
