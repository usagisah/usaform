<script lang="ts" setup>
import { ElDivider } from "element-plus"

const props = defineProps<{ content: string }>()
</script>

<template>
  <ElDivider>{{ props.content }}</ElDivider>
</template>
