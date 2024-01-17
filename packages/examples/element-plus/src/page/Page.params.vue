<script lang="ts" setup>
import { useFormPlainField } from "@usaform/element-plus"
import { ElCard, ElSpace } from "element-plus"
import { reactive } from "vue"

const params = reactive({ search: "", footer: "" })
const { actions } = useFormPlainField("params", () => ({}))
actions.subscribe(
  "../search",
  v => {
    params.search = JSON.stringify(v)
  },
  { immediate: true }
)
actions.subscribe(
  "../footer",
  v => {
    params.footer = JSON.stringify(v)
  },
  { immediate: true }
)
</script>

<template>
  <ElCard style="width: 95vw">
    <div class="params">
      <h3>所有内容都是单独的文件: 搜索，表格，分页，底部</h3>
      <div>
        <h3>交互逻辑</h3>
        <ul>
          <li>搜索触发表格渲染</li>
          <li>搜索会触发分页器修改</li>
          <li>表格底部配置触发表格渲染</li>
        </ul>
      </div>
      <div>
        <h3>页面内部的所有参数</h3>
        <ul>
          <li>顶部搜索参数: {{ params.search }}</li>
          <li>表格底部参数: {{ params.footer }}</li>
        </ul>
      </div>
    </div>
  </ElCard>
</template>

<style lang="scss" scoped>
.params {
  display: flex;
  justify-content: space-between;
  
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
