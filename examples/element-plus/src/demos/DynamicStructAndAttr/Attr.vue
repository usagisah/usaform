<script lang="ts" setup>
import { createForm, exportFormStructJson, PlainField } from "@shoroi/form"
import { ElButton, ElCard, ElInput, ElSpace } from "element-plus"
import { shallowRef } from "vue"

const disabled = shallowRef(false)
const [Form, form] = createForm()
const toJson = () => console.log(exportFormStructJson(form.value!.field))
</script>

<template>
  <ElCard style="margin: 0 auto; width: 45%">
    <Form>
      <PlainField key="a" :layoutProps="{ label: '跟随全局禁用', disabled }">
        <template #default="{ bind, ...p }">
          <ElInput v-bind="bind" />
        </template>
      </PlainField>

      <PlainField key="b" :layout-props="{ label: '跟随全局禁用', disabled }">
        <template #default="{ bind }">
          <ElInput v-bind="bind" />
        </template>
      </PlainField>

      <PlainField key="c" :layout-props="{ label: '跟随全局禁用', disabled }">
        <template #default="{ bind }">
          <ElInput v-bind="bind" />
        </template>
      </PlainField>
    </Form>

    <ElSpace>
      <ElButton @click="disabled = !disabled">切换禁用状态-{{ disabled }}</ElButton>
      <ElButton @click="toJson">打印 json</ElButton>
    </ElSpace>
  </ElCard>
</template>
