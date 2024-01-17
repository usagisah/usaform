<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus"
import { inject } from "vue"
defineProps<{ actions: any }>()
const value = defineModel<number>()
const data = inject<any>("formData")!
</script>

<template>
  <ElSelect v-model="value" style="width: 220px">
    <ElOption v-for="item in data.types" :key="item.id" :label="item.title" :value="item.id" />
  </ElSelect>
</template>
