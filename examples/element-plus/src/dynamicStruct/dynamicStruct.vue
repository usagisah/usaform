<script lang="ts" setup>
import { shallowRef } from "vue"
import { createForm, PlainField } from "@usaform/element-plus"
import { ElButton, ElInput, ElSpace } from "element-plus"

const count = shallowRef(0)
const [Form, form] = createForm({
  dynamic: true,
  config: {
    plainFieldController: "FormItem"
  }
})
const submit = () => console.log(form.value?.getFormData())
</script>

<template>
  <Form>
    <PlainField v-if="count % 2 == 0" name="a" :layoutProps="{ label: '单数' }">
      <template #default="{ bind, ...p }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>

    <PlainField v-if="count % 2 !== 0" name="b" :layout-props="{ label: '双数' }">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>

    <PlainField v-if="count % 2 == 0" name="c" :layout-props="{ label: '单数' }">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>
  </Form>

  <ElSpace>
    <ElButton @click="count++">递增 count -- {{ count }}</ElButton>
    <ElButton @click="submit"></ElButton>
  </ElSpace>
</template>
