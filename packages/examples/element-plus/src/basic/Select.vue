<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus"
const value = defineModel<string>()
</script>

<template>
  <ElSelect v-model="value">
    <ElOption label="1" value="1" />
    <ElOption label="2" value="2" />
    <ElOption label="3" value="3" />
  </ElSelect>
</template>

<style lang="scss" scoped></style>
