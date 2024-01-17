<script lang="ts" setup>
import { ElRadioGroup, ElRadio } from "element-plus"
const value = defineModel<string>()
</script>

<template>
  <el-radio-group v-model="value">
    <el-radio label="1" size="large">Option 1</el-radio>
    <el-radio label="2" size="large">Option 2</el-radio>
  </el-radio-group>
</template>

<style lang="scss" scoped></style>
