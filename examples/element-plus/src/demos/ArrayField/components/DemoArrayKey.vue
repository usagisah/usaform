<script lang="ts" setup>
import { CArrayFieldActions, PlainField } from "@shoroi/form"
import { ElButton, ElSpace } from "element-plus"

const props = defineProps<{ value: any[]; actions: CArrayFieldActions }>()
</script>

<template>
  <div v-for="(item, i) in props.value" :key="item.id">
    <PlainField :name="i" element="ElInput" :props="{ placeholder: '请输入名称' }" layout="FormItem" :layout-props="{ label: '名称' }"> </PlainField>
  </div>

  <ElSpace>
    <ElButton @click="props.actions.push({ id: Math.random(), value: props.value.length })">尾部添加</ElButton>
    <ElButton @click="props.actions.pop()">尾部删除</ElButton>
    <ElButton @click="props.actions.unshift({ id: Math.random(), value: props.value.length })">头部添加</ElButton>
    <ElButton @click="props.actions.shift()">头部删除</ElButton>
    <ElButton @click="props.actions.swap(0, props.value.length - 1)" v-if="props.value.length >= 2">首尾交换</ElButton>
  </ElSpace>
</template>
