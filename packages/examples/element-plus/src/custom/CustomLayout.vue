<script lang="tsx" setup>
import { ref } from "vue"
import { CFieldLayoutInfo } from "@usaform/element-plus"
import { ElCard, ElDivider } from "element-plus"

const props = defineProps<{ __fieldInfo: any }>()
const { children }: CFieldLayoutInfo = props.__fieldInfo
const count = ref(0)
defineExpose({
  increase: () => count.value++
})
</script>

<template>
  <ElCard style="width: 800px">
    <template #header>
      <h1>自定义布局</h1>
    </template>
    <ElDivider content-position="center">布局自定义事件调用次数：{{ count }}</ElDivider>
    <div><children /></div>
  </ElCard>
</template>

<style lang="scss" scoped></style>
