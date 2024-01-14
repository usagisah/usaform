<script lang="ts" setup>
import { CArrayFieldAttrs } from "@usaform/element-plus"
import { ElInput } from "element-plus"
const props = defineProps<{ data: any; modelValue: any; actions: any }>()
const value = defineModel<string>()

const { subscribe }: CArrayFieldAttrs["actions"] = props.actions
subscribe("operate", () => {
  value.value = ""
})
</script>

<template>
  <ElInput v-model="value"> </ElInput>
</template>

<style lang="scss" scoped></style>
