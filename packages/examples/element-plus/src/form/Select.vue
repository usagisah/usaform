<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus"
import { computed } from "vue"
const props = defineProps<{ modelValue: any; onChange: any }>()

const emit = defineEmits(["update:modelValue"])
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit("update:modelValue", value)
    props.onChange?.(value)
  }
})
</script>

<template>
  <ElSelect v-model="value">
    <ElOption label="1" value="1" />
    <ElOption label="2" value="2" />
    <ElOption label="3" value="3" />
  </ElSelect>
</template>

<style lang="scss" scoped></style>
