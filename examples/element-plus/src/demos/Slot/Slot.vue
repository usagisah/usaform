<script lang="ts" setup>
import { createForm, PlainField } from "@shoroi/form"
import { ElCard } from "element-plus"
import { h } from "vue"
import Append from "./components/Append.vue"

const [Form] = createForm()
const PrependComp = () => [h("div", "prepend")]
</script>

<template>
  <ElCard style="margin: 0 auto; width: 45%">
    <Form>
      <PlainField
        name="input"
        element="ElInput"
        :props="{ style: 'width:100%' }"
        :layoutProps="{ label: '组件插槽' }"
        :slots="{
          // 字符串会引用 Form 等层的
          suffix: 'InputSuffix',
          // 函数形式的内联插槽
          prepend: PrependComp,
          // 组件形式的外置插槽
          append: Append
        }"
      >
        <!-- 内部的会直接传过去 -->
        <template #prefix>prefix-slot</template>
      </PlainField>

      <template #InputSuffix>
        <span>suffix-slot</span>
      </template>
    </Form>
  </ElCard>
</template>
