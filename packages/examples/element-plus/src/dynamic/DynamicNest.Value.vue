<script lang="ts" setup>
import { CArrayFieldAttrs } from "@usaform/element-plus"
import { ElInput } from "element-plus"
const props = defineProps<{ actions: any }>()
const value = defineModel<string>()
const { subscribe }: CArrayFieldAttrs["actions"] = props.actions
subscribe("../operate", () => {
  value.value = ""
})
</script>

<template>
  <ElInput v-model="value" style="width: 220px"> </ElInput>
</template>

<style lang="scss" scoped></style>
