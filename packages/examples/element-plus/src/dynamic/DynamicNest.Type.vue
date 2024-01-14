<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus"
import { computed, inject, onUnmounted } from "vue"
const props = defineProps<{ data: any; id: string; disabled: boolean }>()
const value = defineModel<number>()
const data = inject<any>("formData")!

onUnmounted(() => {
  console.log("unmounted select")
})
</script>

<template>
  <ElSelect v-model="value" :id="props.id" :disabled="props.disabled">
    <ElOption v-for="item in data.types" :key="item.id" :label="item.title" :value="item.id" />
  </ElSelect>
</template>

