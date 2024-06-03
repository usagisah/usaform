<script lang="ts" setup>
import { ElCheckbox, ElCheckboxGroup } from "element-plus"
import { useAttrs } from "vue"
const value = defineModel<string[]>()
</script>

<template>
  <el-checkbox-group v-model="value">
    <el-checkbox label="Option A" value="Option A" />
    <el-checkbox label="Option B" value="Option B" />
    <el-checkbox label="Option C" value="Option C" />
    <el-checkbox label="disabled" value="disabled" disabled />
    <el-checkbox label="selected and disabled" value="selected and disabled" disabled />
  </el-checkbox-group>
</template>

<style lang="scss" scoped></style>
