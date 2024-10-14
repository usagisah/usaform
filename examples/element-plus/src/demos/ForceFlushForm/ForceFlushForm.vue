<script lang="ts" setup>
import { createJsonForm, JsonFormConfig, JsonFormStructJson } from "@shoroi/form"
import { ElButton, ElCard, ElSpace } from "element-plus"
import { nextTick, onMounted, reactive } from "vue"

const jsonFormConfig: JsonFormConfig = reactive({ struct: [], config: { defaultFormData: {}, layoutProps: { labelWidth: "80px" } } })
const [Form, formRef, forceUpdateForm] = createJsonForm(jsonFormConfig)

// 模拟异步获取数据
let count = 0
async function apiState() {
  return { group: { f1: count++, f2: count % 2 === 0 ? Date.now() : "" } }
}

async function apiFormJson() {
  return [
    {
      type: "object",
      name: "group",
      children: [
        { type: "plain", name: "f1", element: "ElInput", layoutProps: { label: "字段1" } },
        { type: "plain", name: "f2", element: "ElInput", layoutProps: { label: "字段2" } }
      ]
    }
  ] as JsonFormStructJson[]
}

formRef.value?.onForceRenderForm(() => {
  console.log("forceRender", formRef.value.getFormData())
  formRef.value.subscribe("group/.*", console.log)
})

function flush() {
  setTimeout(async () => {
    const [data, json] = await Promise.all([apiState(), apiFormJson()])
    jsonFormConfig.struct = json

    // way 1
    // await nextTick()
    // jsonFormConfig.config!.defaultFormData = data

    // way 2
    await nextTick()
    formRef.value.set("", data)

    // way 3
    // jsonFormConfig.config!.defaultFormData = data
    // forceUpdateForm()
  }, 200)
}

onMounted(() => {
  flush()
})
</script>

<template>
  <ElCard title="同页面刷新不同数据的表单" style="margin: 0 auto; width: 45%">
    <Form />

    <ElSpace>
      <ElButton @click="flush">刷新</ElButton>
    </ElSpace>
  </ElCard>
</template>
