<script lang="ts" setup>
import { ElCheckbox, ElCheckboxGroup } from "element-plus"
import { useAttrs } from "vue";
const value = defineModel<string[]>()
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
