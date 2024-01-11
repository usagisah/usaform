<script lang="ts" setup>
import { ElCheckbox, ElCheckboxGroup } from "element-plus"
import { computed } from "vue";
const props = defineProps<{ modelValue: any; onChange: any }>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get() {
    return props.modelValue ?? []
  },
  set(value) {
    emit("update:modelValue", value)
    props.onChange?.(value)
  }
})
</script>

<template>
  <el-checkbox-group v-model="value">
    <el-checkbox label="Option A" />
    <el-checkbox label="Option B" />
    <el-checkbox label="Option C" />
    <el-checkbox label="disabled" disabled />
    <el-checkbox label="selected and disabled" disabled />
  </el-checkbox-group>
</template>

<style lang="scss" scoped></style>
