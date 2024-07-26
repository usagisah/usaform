<script lang="ts" setup>
import { CArrayFieldActions, ObjectField, PlainField } from "@shoroi/form"
import { ElButton, ElSpace } from "element-plus"
const props = defineProps<{ fieldValue: any[]; actions: any }>()
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
  <ObjectField v-for="(item, index) in props.fieldValue" :key="item.itemId" :name="index" layout="FormItem">
    <PlainField layout="FormItem" :layout-props="{ label: '运算类型' }" name="type" element="DynamicType" />
    <PlainField layout="FormItem" :layout-props="{ label: '运算方式' }" name="operate" element="DynamicOperate" />
    <PlainField layout="FormItem" :layout-props="{ label: '运算备注' }" name="value" element="DynamicValue" />
    <ElButton v-if="props.fieldValue.length !== 1" type="danger" @click="remove(index)">移除条目</ElButton>
  </ObjectField>
  <ElSpace>
    <ElButton type="primary" @click="add">添加条目</ElButton>
  </ElSpace>
</template>
