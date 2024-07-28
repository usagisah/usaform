<script lang="ts" setup>
import { ArrayField, CArrayFieldActions } from "@shoroi/form"
import { ElDivider } from "element-plus"
const props = defineProps<{ value: any[]; actions: CArrayFieldActions }>()
</script>

<template>
  <ElDivider content-position="center">分组配置</ElDivider>
  <div v-for="(item, index) in props.value" :key="item.groupId">
    <ArrayField :name="index" element="DynamicItem" />
  </div>
</template>
