<script lang="ts" setup>
import { ArrayFieldAttrs } from "@usaform/element-plus"
import { ElInput } from "element-plus"
import { computed, useAttrs } from "vue"
const props = defineProps<{ data: any; modelValue: any; actions: any }>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit("update:modelValue", value)
  }
})

const { subscribe }: ArrayFieldAttrs["actions"] = props.actions
subscribe("operate", () => {
  value.value = ""
})
</script>

<template>
  <ElInput v-model="value"> </ElInput>
</template>

<style lang="scss" scoped></style>
