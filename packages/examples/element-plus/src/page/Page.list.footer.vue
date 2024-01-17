<script lang="ts" setup>
import { useFormPlainField } from "@usaform/element-plus"
import { ElPagination } from "element-plus"

const { fieldValue: data } = useFormPlainField("footer", () => {
  return { initValue: { total: 500, page: 1, size: 10 } }
})
const onChange = (page?: number, size?: number) => {
  if (page) data.value = { ...data.value, page }
  if (size) data.value = { ...data.value, size }
}
</script>

<template>
  <div class="page">
    <div class="l">
      <div>表格底部配置</div>
    </div>
    <div class="r">
      <div>其他配置项 1</div>
      <div>其他配置项 2</div>
      <ElPagination v-model:current-page="data.page" v-model:page-size="data.size" :page-sizes="[100, 15, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="data.total" @size-change="onChange(undefined, $event)" @current-change="onChange($event)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .l,
  .r {
    display: flex;
    justify-content: flex-end;
    gap: 2rem;
    align-items: center;
  }
}
</style>
