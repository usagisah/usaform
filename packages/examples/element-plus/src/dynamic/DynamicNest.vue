<script lang="ts" setup>
import { provide, reactive, ref } from "vue"
import { ElDivider, ElCard, ElButton } from "element-plus"
import { Form, FormConfig, FormItem, CFormExpose, ArrayField } from "@usaform/element-plus"

/* -------------- 模拟三级表单中的内容，这里为了方便，写死并用 provide 共享 -------------- */
const fetchData = reactive({
  types: [
    { id: 1, title: "乘除法" },
    { id: 2, title: "加减法" }
  ],
  operates: {
    1: ["*", "/"],
    2: ["+", "-"]
  }
})
provide("formData", fetchData)

/* -------------- 设置默认值 -------------- */
const fidFirstData = {
  dynamic: [
    {
      groupId: 1,
      children: [
        {
          itemId: 11,
          children: {
            type: 1,
            operate: "*",
            value: "首屏文本"
          }
        }
      ]
    }
  ]
}
const formConfig: FormConfig = { defaultFormData: fidFirstData }

/* -------------- 基础操作 -------------- */
const form = ref<CFormExpose | null>(null)
const submit = () => {
  console.log(form.value!.getFormData())
}
const validate = async () => {
  console.log(await form.value!.validate())
}
const reset = () => {
  form.value!.reset()
  form.value!.set("", fidFirstData)
}

/* -------------- 动态更新 -------------- */
setTimeout(() => {
  form.value!.set("dynamic", [
    {
      groupId: 1,
      children: [
        {
          itemId: 11,
          children: {
            type: 2,
            operate: "+",
            value: "动态修改"
          }
        }
      ]
    }
  ])
}, 5000)
</script>

<template>
  <ElCard style="width: 1000px">
    <template #header>指定 key</template>
    <Form :config="formConfig" ref="form">
      <ArrayField name="dynamic" element="DynamicGroup" />
      <ElDivider content-position="center">(布局样式) 提交</ElDivider>
      <FormItem>
        <ElButton @click="submit">submit</ElButton>
        <ElButton @click="validate">validate</ElButton>
        <ElButton type="danger" @click="reset">reset</ElButton>
      </FormItem>
    </Form>
  </ElCard>
</template>
