<script lang="ts" setup>
import { ElAlert, ElButton, ElDivider, ElLink, ElSpace } from "element-plus"
import { ref, shallowReactive } from "vue"
import Basic from "./basic/Basic.vue"
import Obj from "./group/Object.vue"
import Arr from "./array/Array.vue"
import Dynamic from "./dynamic/DynamicNest.vue"
import Custom from "./custom/Custom.vue"
import Step from "./step/Step.vue"
import Page from "./page/Page.vue"
import Json from "./json/Json.vue"

const list = shallowReactive([
  { n: "普通平铺", d: "基本的平铺写法，与直接使用 ElForm 差不多", c: Basic },
  { n: "对象嵌套", d: "以对象的形式深层次嵌套", c: Obj },
  { n: "数组表单", d: "数组形式的动态表单", c: Arr },
  { n: "复杂嵌套", d: "3者混合的动态表单，演示功能：多层嵌套，多字段联动，动态更新，跨字段监听", c: Dynamic },
  { n: "自定义", d: "", c: Custom },
  { n: "分步表单", d: "", c: Step },
  { n: "系统页面", d: "", c: Page },
  { n: "json 转表单", d: "", c: Json }
])
const act = ref(0)
</script>

<template>
  <div class="layout">
    <ElSpace>
      <ElButton v-for="(item, index) in list" :key="item.n" @click="act = index" :type="index === act ? 'primary' : 'default'">
        {{ item.n }}
      </ElButton>
    </ElSpace>
    <ElSpace>
      <ElAlert v-if="act <= 3" style="width: 400px" center :closable="false" title="打开vue的调试工具(devTools)可以看到具体的更新范围，点提交可以在控制台看到返回的数据结构" />
      <ElAlert v-if="list[act].d.length > 0" style="width: 400px" center :closable="false" :title="list[act].d" />
    </ElSpace>
    <ElDivider title="内容区域"></ElDivider>
    <div class="form">
      <component :is="list[act].c" />
    </div>
  </div>
</template>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100vw;
}
</style>
