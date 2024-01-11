<script lang="ts" setup>
import {} from "vue"
import { useForm } from "@usaform/element-plus"
import Search from "./Page.search.vue"
import Config from "./Page.config.vue"
import List from "./Page.list.vue"

const form = useForm({})
form.provide()
</script>

<template>
  <Search />
  <Config />
  <List />
</template>

<style lang="scss" scoped></style>
