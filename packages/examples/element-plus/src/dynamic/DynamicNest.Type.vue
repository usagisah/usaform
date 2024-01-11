<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus"
import { computed, inject, onUnmounted } from "vue"
const props = defineProps<{ data: any, modelValue: any, id: string, disabled: boolean }>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit("update:modelValue", value)
  }
})

const data = inject<any>("formData")!

onUnmounted(() => {
  console.log( "unmounted select" )
})
</script>

<template>
  <ElSelect v-model="value" :id="props.id" :disabled="props.disabled">
    <ElOption v-for="item in data.types" :key="item.id" :label="item.title" :value="item.id" />
  </ElSelect>
</template>

<style lang="scss" scoped></style>
