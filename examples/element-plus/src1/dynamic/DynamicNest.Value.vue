<script lang="ts" setup>
import { CArrayFieldAttrs, onNextTick } from "@shoroi/form"
import { ElInput } from "element-plus"
const props = defineProps<{ actions: any }>()
const value = defineModel<string>()
const { subscribe }: CArrayFieldAttrs["actions"] = props.actions
onNextTick(() => {
  return subscribe("../operate", () => {
    value.value = ""
  })
})
</script>

<template>
  <ElInput v-model="value" style="width: 220px"> </ElInput>
</template>

<style lang="scss" scoped></style>
