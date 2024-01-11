<script lang="ts" setup>
import { PlainField } from "@usaform/element-plus"
import { ElButton, ElSpace } from "element-plus"
import {} from "vue"

defineOptions({
  inheritAttrs: false
})
const props = defineProps<{ fields: any; actions: any }>()
</script>

<template>
  <div v-for="(item, i) in fields" :key="item.id">
    <PlainField :name="i" layout="FormItem" :layout-props="{ label: '名称', required: true }" element="ElInput" :props="{ placeholder: '请输入名称' }" />
  </div>
  <ElSpace>
    <ElButton @click="props.actions.push({ id: Math.random(), value: '11111111' })">add</ElButton>
    <ElButton @click="props.actions.pop()">pop</ElButton>
    <ElButton @click="props.actions.unshift({ id: Math.random(), value: '2222' })">unshift</ElButton>
    <ElButton @click="props.actions.shift()">shift</ElButton>
    <ElButton @click="props.actions.swap(0, fields.length - 1)">swap</ElButton>
  </ElSpace>
</template>

<style lang="scss" scoped></style>
