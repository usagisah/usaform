<script lang="ts" setup>
import { ObjectField, PlainField, ArrayFieldAttrs } from "@usaform/element-plus"
import { ElButton, ElSpace } from "element-plus"
import { onUnmounted } from "vue"

defineOptions({
  inheritAttrs: false
})
const props = defineProps<{ fields: any[]; actions: any }>()
onUnmounted(() => {
  console.log("onUnmounted, item")
})

const api: ArrayFieldAttrs["actions"] = props.actions
const add = () => {
  api.push({ itemId: Math.random() })
}
const remove = (i: number) => {
  api.delValue(i)
}
</script>

<template>
  <ObjectField v-for="(item, index) in props.fields" :key="item.itemId" :name="index" layout="FormItem">
    <template #default="{ actions }">
      <PlainField layout="FormItem" :layout-props="{ label: '运算类型' }" name="type" element="DynamicType" :props="{ data: item, actions }" />
      <PlainField layout="FormItem" :layout-props="{ label: '运算方式' }" name="operate" element="DynamicOperate" :props="{ data: item, actions }" />
      <PlainField layout="FormItem" :layout-props="{ label: '运算备注' }" name="value" element="DynamicValue" :props="{ data: item, actions }" />
      <ElButton v-if="props.fields.length !== 1" type="danger" @click="remove(index)">移除条目</ElButton>
    </template>
  </ObjectField>
  <ElSpace>
    <ElButton type="primary" @click="add">添加条目</ElButton>
  </ElSpace>
</template>

<style lang="scss" scoped></style>
