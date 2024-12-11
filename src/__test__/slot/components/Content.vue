<script lang="ts" setup>
import {} from "vue"

defineSlots<{
  s1(): any
  s2(): any
  s3(): any
  s4(): any
}>()
</script>

<template>
  <div class="slot-content">
    <slot />
    <slot name="s1" />
    <slot name="s2" />
    <slot name="s3" />
    <slot name="s4" />
  </div>
</template>
