<script lang="ts" setup>
import { useAttrs, useSlots } from "vue"

console.log( useAttrs(), useSlots() )
</script>

<template>
<div class="O1">
  <slot />
</div>
</template>

<style lang="scss" scoped>

</style>