<script lang="ts" setup>
import { createForm, exportFormStructJson, PlainField } from "@shoroi/form"
import { ElButton, ElCard } from "element-plus"

const [Form, form] = createForm()

const submit = () => {
  console.log(form.value?.getFormData())
}
const validate = async () => {
  console.log(await form.value?.validate())
}
const reset = () => {
  form.value?.reset()
}
const printJson = () => {
  console.log(exportFormStructJson(form.value!.field))
}
const callField = () => {
  form.value?.call("input1", "reset", {
    fieldTypes: ["plain"],
    first: true
  })
}
const callElement = () => {
  console.log(form.value?.callElement("input1", "focus"))
}
const callLayout = () => {
  console.log(form.value?.callLayout("input1", "validate"))
}
const setProps = () => {
  console.log(
    form.value?.setProps("input1", () => {
      return { props: { placeholder: "请输入" } }
    })
  )
}
</script>

<template>
  <div style="display: flex; justify-content: center; gap: 1rem">
    <ElCard style="width: 60%">
      <template #header>调用到内部方法</template>
      <Form>
        <PlainField
          name="input"
          element="ElInput"
          :layoutProps="{ label: '标题', rules: [{ required: true, trigger: 'blur', message: '该字段是必填的', type: 'string', min: 1 }] }"
        />
        <PlainField
          name="input1"
          element="ElInput"
          :layoutProps="{ label: '标题', rules: [{ required: true, trigger: 'blur', message: '该字段是必填的', type: 'string', min: 1 }] }"
        />

        <ElButton @click="validate">校验</ElButton>
        <ElButton @click="reset">清空</ElButton>
        <ElButton @click="printJson">打印json</ElButton>
        <ElButton @click="submit">提交</ElButton>
        <ElButton @click="callField">调用指定字段方法-reset</ElButton>
        <ElButton @click="callElement">调用指定数据字段方法-focus</ElButton>
        <ElButton @click="callLayout">调用指定控制器方法-validate</ElButton>
        <ElButton @click="setProps">修改指定字段参数-setProps</ElButton>
      </Form>
    </ElCard>
  </div>
</template>
