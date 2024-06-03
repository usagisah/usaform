<script lang="tsx" setup>
import { ref } from "vue"
import { FormControllerProps } from "@usaform/element-plus"
import { ElCard, ElDivider } from "element-plus"

const props = defineProps<{ FormControllerProps: FormControllerProps }>()
const { children } = props.FormControllerProps
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
    <div>
      <component :is="children" :bind="{}" :props="{}" />
    </div>
  </ElCard>
</template>

