<script lang="ts" setup>
import { CArrayFieldActions, PlainField } from "@shoroi/form"
import { ElButton, ElSpace } from "element-plus"

const props = defineProps<{ fieldValue: any[]; actions: CArrayFieldActions }>()
</script>

<template>
  <div v-for="(item, i) in fieldValue" :key="item.id">
    <PlainField :name="i" layout="FormItem" :layout-props="{ label: '名称' }" element="ElInput" :props="{ placeholder: '请输入名称' }" />
  </div>
  <ElSpace>
    <ElButton @click="props.actions.push({ id: Math.random(), value: '尾部添加' })">尾部添加</ElButton>
    <ElButton @click="props.actions.pop()">尾部删除</ElButton>
    <ElButton @click="props.actions.unshift({ id: Math.random(), value: '头部添加' })">头部添加</ElButton>
    <ElButton @click="props.actions.shift()">头部删除</ElButton>
    <ElButton @click="props.actions.swap(0, fieldValue.length - 1)" v-if="fieldValue.length >= 2">首尾交换</ElButton>
  </ElSpace>
</template>
