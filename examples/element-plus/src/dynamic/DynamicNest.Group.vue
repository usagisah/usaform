<script lang="ts" setup>
import { ArrayField } from "@usaform/element-plus"
import { ElDivider } from "element-plus"
const props = defineProps<{ fieldValue: any; actions: any }>()
</script>

<template>
  <ElDivider content-position="center">分组配置</ElDivider>
  <div v-for="(item, index) in props.fieldValue" :key="item.groupId">
    <ArrayField :name="index" element="DynamicItem" />
  </div>
</template>
