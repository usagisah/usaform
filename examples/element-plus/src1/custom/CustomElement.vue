<script lang="ts" setup>
import { ElInputNumber } from "element-plus"
import {} from "vue"

const value = defineModel<number>({ default: 0 })
defineExpose({
  increase: () => {
    value.value++
  }
})
</script>

<template>
  <ElInputNumber v-model="value"></ElInputNumber>
</template>

<style lang="scss" scoped></style>
