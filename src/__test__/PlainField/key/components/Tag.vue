<script lang="ts" setup>
import { CFormExpose } from "@shoroi/form"

const props = defineProps<{ actions: CFormExpose }>()
const modelValue = defineModel<string[]>()
</script>

<template>
  <div class="tag">
    <div v-for="s in modelValue">{{ s }}</div>
  </div>
</template>
