<script lang="ts" setup>
import { ElButton, ElCard } from "element-plus"
import { shallowReactive } from "vue"
import ArrayForm from "./ArrayForm.vue"
import ObjectForm from "./ObjectForm.vue"
import PlainForm from "./PlainForm.vue"

const formOptions = shallowReactive({ current: "PlainForm", PlainForm, ObjectForm, ArrayForm })
</script>

<template>
  <ElCard title="json 转组件爱你" style="width: 1200px">
    <div style="display: flex; justify-content: center; align-items: center; gap: 1rem">
      <ElButton :type="formOptions.current === 'PlainForm' ? 'primary' : 'default'" @click="formOptions.current = 'PlainForm'">json转<b>普通</b>表单</ElButton>
      <ElButton :type="formOptions.current === 'ObjectForm' ? 'primary' : 'default'" @click="formOptions.current = 'ObjectForm'">json转<b>嵌套</b>表单</ElButton>
      <ElButton :type="formOptions.current === 'ArrayForm' ? 'primary' : 'default'" @click="formOptions.current = 'ArrayForm'">json转<b>数组</b>表单</ElButton>
    </div>

    <div>
      <component :is="formOptions[formOptions.current]" />
    </div>
  </ElCard>
</template>
