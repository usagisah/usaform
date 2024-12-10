<script lang="ts" setup>
import { CArrayFieldActions, ObjectField, PlainField } from "@shoroi/form"
import { ElButton, ElSpace } from "element-plus"

const props = defineProps<{ value: any[]; actions: CArrayFieldActions }>()
const api: CArrayFieldActions = props.actions

const add = () => {
  api.push({
    itemId: Math.random(),
    children: {
      type: 1,
      operate: "*",
      value: "添加文本"
    }
  })
}
const remove = (i: number) => {
  api.delValue(i)
}
</script>

<template>
  <ObjectField v-for="(item, index) in props.value" :key="item.itemId" :key="index" layout="FormItem">
    <PlainField layout="FormItem" :layout-props="{ label: '运算类型' }" key="type" element="DynamicType" />
    <PlainField layout="FormItem" :layout-props="{ label: '运算方式' }" key="operate" element="DynamicOperate" />
    <PlainField layout="FormItem" :layout-props="{ label: '运算备注' }" key="value" element="DynamicValue" />
    <ElButton v-if="props.value.length !== 1" type="danger" @click="remove(index)">移除条目</ElButton>
  </ObjectField>
  <ElSpace>
    <ElButton type="primary" @click="add">添加条目</ElButton>
  </ElSpace>
</template>
