<script lang="ts" setup>
import { ArrayField } from "@usaform/element-plus"
import { ElDivider } from "element-plus"
import { onBeforeUnmount } from "vue"

defineOptions({
  inheritAttrs: false
})
const props = defineProps<{ fields: any; actions: any }>()
onBeforeUnmount(() => {
  console.log("onUnmounted, group")
})
</script>

<template>
  <ElDivider content-position="center">分组配置</ElDivider>
  <div v-for="(item, index) in props.fields" :key="item.groupId">
    <ArrayField :name="index" element="DynamicItem" />
  </div>
</template>

<style lang="scss" scoped></style>
