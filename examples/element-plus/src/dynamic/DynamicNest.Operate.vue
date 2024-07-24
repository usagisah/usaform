<script lang="ts" setup>
import { CArrayFieldActions, onNextTick } from "@usaform/element-plus"
import { ElOption, ElSelect } from "element-plus"

import { inject, ref } from "vue"
const props = defineProps<{ actions: any }>()
const value = defineModel<string>()
const _data = inject<any>("formData")!
const operates = ref<any>([])
const { subscribe }: CArrayFieldActions = props.actions

onNextTick(() => {
  return subscribe(
    "../type",
    (v, ov, info) => {
      const o = (operates.value = _data.operates[v])
      value.value = o[0]
      console.log( "发生变化的字段:", info)
    },
    { immediate: true }
  )
})
</script>

<template>
  <ElSelect v-model="value" style="width: 220px">
    <ElOption v-for="item in operates" :key="item" :label="item" :value="item" />
  </ElSelect>
</template>

<style lang="scss" scoped></style>
