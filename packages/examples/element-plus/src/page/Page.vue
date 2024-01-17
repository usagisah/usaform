<script lang="ts" setup>
import Search from "./Page.search.vue"
import Params from "./Page.params.vue"
import List from "./Page.list.vue"
import ListFooter from "./Page.list.footer.vue"
import { ElCard, ElSpace } from "element-plus"
import { useForm } from "@usaform/element-plus"

const { actions, FieldRender } = useForm({})
actions.provide()
</script>

<template>
  <FieldRender>
    <ElSpace direction="vertical" size="default">
      <Search />
      <ElCard style="width: 95vw">
        <List />
        <ListFooter />
      </ElCard>
      <Params />
    </ElSpace>
  </FieldRender>
</template>

<style lang="scss" scoped></style>
