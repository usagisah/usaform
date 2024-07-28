<script lang="ts" setup>
import { ArrayField, createForm, FormItem } from "@shoroi/form"
import { ElButton, ElCard, ElDivider } from "element-plus"
import { onUnmounted, provide, reactive, ref } from "vue"
import DynamicGroup from "./components/DynamicNest.Group.vue"
import DynamicItem from "./components/DynamicNest.Item.vue"
import DynamicOperate from "./components/DynamicNest.Operate.vue"
import DynamicType from "./components/DynamicNest.Type.vue"
import DynamicValue from "./components/DynamicNest.Value.vue"

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
const firstScreenFormData = {
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

/* -------------- 基础操作 -------------- */
const [Form, form] = createForm({
  config: { Elements: { DynamicGroup, DynamicItem, DynamicType, DynamicOperate, DynamicValue }, defaultFormData: firstScreenFormData }
})
const submit = () => {
  console.log(form.value!.getFormData())
}
const validate = async () => {
  console.log(await form.value!.validate())
}
const reset = () => {
  form.value!.reset()
  form.value!.set("", firstScreenFormData)
}

/* -------------- 动态更新 -------------- */
const t = ref(5)
const id = setInterval(() => {
  if (t.value <= 0) {
    form.value?.set("dynamic", [
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
    return clearInterval(id)
  }
  t.value--
}, 1000)
onUnmounted(() => {
  clearInterval(id)
})
</script>

<template>
  <ElDivider content-position="center">首屏 {{ t }} 秒后，模拟接口动态更新表单，注意第一条的内容变化</ElDivider>
  <ElCard style="margin: auto; width: 1000px">
    <template #header>封装一个，复杂的，动态的，多层嵌套的表单</template>
    <Form>
      <ArrayField name="dynamic" element="DynamicGroup" />
      <ElDivider content-position="center">提交</ElDivider>
      <FormItem>
        <ElButton @click="submit">submit</ElButton>
        <ElButton @click="validate">validate</ElButton>
        <ElButton type="danger" @click="reset">reset</ElButton>
      </FormItem>
    </Form>
  </ElCard>
</template>
