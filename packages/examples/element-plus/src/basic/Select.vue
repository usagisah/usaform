<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus"
import { watch } from "vue";
const props = defineProps<{ onChange: any }>()
const value = defineModel<string>()
watch(value, v => props.onChange?.(v))
</script>

<template>
  <ElSelect v-model="value">
    <ElOption label="1" value="1" />
    <ElOption label="2" value="2" />
    <ElOption label="3" value="3" />
  </ElSelect>
</template>

<style lang="scss" scoped></style>
