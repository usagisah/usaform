<script lang="ts" setup>
import { createForm, PlainField } from "@shoroi/form"
import { defineComponent, h } from "vue"
import Content from "./components/Content.vue"

const [Form] = createForm({ config: { Elements: { Content } } })
const s2 = () => [h("div", { class: "slot-2" }, "slot-2")]
const s3 = defineComponent({
  setup() {
    return () => h("div", { class: "slot-3" }, "slot-3")
  }
})
</script>

<template>
  <Form>
    <PlainField
      key="slot"
      element="Content"
      :slots="{
        // 引用 插槽
        s1: 's1',
        // 函数 插槽
        s2,
        // 组件 插槽
        s3
      }"
    >
      <!-- 内部插槽 -->
      <!-- 内部的会直接传过去 -->
      <template #s4>
        <div class="slot-4">slot-4</div>
      </template>

      <template #default>
        <div class="slot-default">slot-default</div>
      </template>
    </PlainField>

    <template #s1>
      <div class="slot-1">slot-1</div>
    </template>
  </Form>
</template>
