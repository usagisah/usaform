<script lang="ts" setup>
import { CArrayFieldAttrs, onNextTick } from "@usaform/element-plus"
import { ElOption, ElSelect } from "element-plus"
import { inject, ref } from "vue"
const props = defineProps<{ actions: any }>()
const value = defineModel<string>()
const _data = inject<any>("formData")!
const operates = ref<any>([])
const { subscribe }: CArrayFieldAttrs["actions"] = props.actions
onNextTick(() => {
  return subscribe(
    "../type",
    v => {
      const o = (operates.value = _data.operates[v])
      value.value = o[0]
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
