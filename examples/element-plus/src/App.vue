<script lang="ts" setup>
import { ElButton, ElDivider } from "element-plus"
import { RouterLink, RouterView } from "vue-router"
import { routes } from "./main"
</script>

<template>
  <div class="fast-link-wrapper">
    <RouterLink v-for="(v, i) in routes" :key="i" :to="v.path">
      <ElButton>{{ v.path }}</ElButton>
    </RouterLink>
  </div>
  <ElDivider>demo</ElDivider>

  <RouterView />
</template>

<style>
.fast-link-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
