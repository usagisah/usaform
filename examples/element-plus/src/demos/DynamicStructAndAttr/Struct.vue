<script lang="ts" setup>
import { createForm, exportFormStructJson, PlainField } from "@shoroi/form"
import { ElButton, ElCard, ElInput, ElSpace } from "element-plus"
import { shallowRef } from "vue"

const count = shallowRef(0)
const [Form, form] = createForm({
  dynamic: true,
  config: {
    plainFieldController: "FormItem"
  }
})
const toJson = () => console.log(exportFormStructJson(form.value!.field))
</script>

<template>
  <ElCard style="margin: 0 auto; width: 45%">
    <Form>
      <PlainField v-if="count % 2 == 0" key="a" :layoutProps="{ label: '单数' }">
        <template #default="{ bind, ...p }">
          <ElInput v-bind="bind" />
        </template>
      </PlainField>

      <PlainField v-if="count % 2 !== 0" key="b" :layout-props="{ label: '双数' }">
        <template #default="{ bind }">
          <ElInput v-bind="bind" />
        </template>
      </PlainField>

      <PlainField v-if="count % 2 == 0" key="c" :layout-props="{ label: '单数' }">
        <template #default="{ bind }">
          <ElInput v-bind="bind" />
        </template>
      </PlainField>
    </Form>

    <ElSpace>
      <ElButton @click="count++">递增 count -- {{ count }}</ElButton>
      <ElButton @click="toJson">打印 json</ElButton>
    </ElSpace>
  </ElCard>
</template>
