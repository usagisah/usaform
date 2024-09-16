<script lang="ts" setup>
import { createJsonForm, JsonFormConfig, JsonFormStructJson } from "@shoroi/form"
import { ElButton, ElCard, ElSpace } from "element-plus"
import { nextTick, onMounted, shallowReactive } from "vue"

const jsonFormConfig: JsonFormConfig = shallowReactive({ struct: [], config: { layoutProps: { labelWidth: "80px" } } })
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

function flush() {
  setTimeout(async () => {
    const [data, json] = await Promise.all([apiState(), apiFormJson()])

    // 如果正常流程不生效，可以试试加着两行
    forceUpdateForm()
    await nextTick()

    jsonFormConfig.struct = json
    formRef.value?.set("", data)

    setTimeout(() => {
      console.log(Object.fromEntries(formRef.value?.get("group/.*", { shallow: false }) as any[]))
    }, 0)
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
