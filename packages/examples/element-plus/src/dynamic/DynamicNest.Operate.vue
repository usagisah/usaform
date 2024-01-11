<script lang="ts" setup>
import { ArrayFieldAttrs } from "@usaform/element-plus"
import { ElOption, ElSelect } from "element-plus"
import { computed, inject, ref } from "vue"
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

const _data = inject<any>("formData")!
const operates = ref<any>([])
const { get, subscribe }: ArrayFieldAttrs["actions"] = props.actions
operates.value = _data.operates[get("type")[0]]
subscribe("type", v => {
  const o = (operates.value = _data.operates[v])
  value.value = o[0]
})
</script>

<template>
  <ElSelect v-model="value">
    <ElOption v-for="item in operates" :key="item" :label="item" :value="item" />
  </ElSelect>
</template>

<style lang="scss" scoped></style>
