<script lang="ts" setup>
import { Space, Alert, Button, Divider } from "ant-design-vue"
import { ref, shallowReactive } from "vue"
import Basic from "./basic/Basic.vue"

const list = shallowReactive([{ n: "普通平铺", d: "基本的平铺写法，与直接使用 ElForm 差不多", c: Basic }])
const act = ref(0)
</script>

<template>
  <div class="layout">
    <Space>
      <Button v-for="(item, index) in list" :key="item.n" @click="act = index" :type="index === act ? 'primary' : 'default'">
        {{ item.n }}
      </Button>
    </Space>
    <Space>
      <Alert v-if="act <= 3" style="width: 400px" center :closable="false" message="打开vue的调试工具(devTools)可以看到具体的更新范围，点提交可以在控制台看到返回的数据结构" />
      <Alert v-if="list[act].d.length > 0" style="width: 400px" center :closable="false" :message="list[act].d" />
    </Space>
    <Divider title="内容区域"></Divider>
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
