<script lang="ts" setup>
import { ElRadioGroup, ElRadio } from "element-plus"
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
  <el-radio-group v-model="value">
    <el-radio label="1" size="large">Option 1</el-radio>
    <el-radio label="2" size="large">Option 2</el-radio>
  </el-radio-group>
</template>

<style lang="scss" scoped></style>
