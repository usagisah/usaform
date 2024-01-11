<script lang="ts" setup>
import { nextTick, ref } from "vue"
import { ElInput, ElSelect, ElInputNumber, ElDivider, ElCard, ElButton, ElDatePicker, ElCascader, ElSpace } from "element-plus"
import { Form, FormConfig, FormItem, PlainField, FormExpose, ArrayField } from "@usaform/element-plus"
import Select from "./form/Select.vue"
import Radio from "./form/Radio.vue"
import Checkbox from "./form/Checkbox.vue"
import ArraySlot from "./array/Array.slot.vue"

const formConfig: FormConfig = {
  Elements: { ElInput, ElSelect, FormItem, ElInputNumber, Select, Radio, Checkbox, ElDatePicker, ElCascader, ArraySlot },
  defaultFormData: {
    array1: [{ value: "1111111" }, { value: "2222222" }]
  }
}
const form = ref<FormExpose | null>(null)
const print = () => {
  console.log(form.value!.getFormData())
}
const validate = async () => {
  console.log(await form.value!.validate())
}
const reset = () => {
  form.value!.reset()
}
nextTick(() => {
  form.value!.subscribe("array1/[0-1]", (nv, ov) => {
    console.log(nv, ov)
  })
})
</script>

<template>
  <div class="form">
    <ElCard>
      <Form :config="formConfig" ref="form">
        <!-- 这两种使用效果一样， -->
        <!-- 但使用 element 不会更新当前组件，性能更好一点 -->

        <ElDivider content-position="center">高性能版本</ElDivider>
        <ArrayField name="array1" element="ArraySlot" />

        <ElDivider content-position="center">简单版本</ElDivider>
        <ArrayField name="array2">
          <template #default="{ fields, actions }">
            <div v-for="(item, i) in fields" :key="item.id">
              <PlainField :name="i" layout="FormItem" :layout-props="{ label: '名称', required: true }" element="ElInput" :props="{ placeholder: '请输入名称' }" />
            </div>
            <ElSpace>
              <ElButton @click="actions.push({ id: Math.random(), value: '11111111' })">add</ElButton>
              <ElButton @click="actions.pop()">pop</ElButton>
              <ElButton @click="actions.unshift({ id: Math.random(), value: '2222' })">unshift</ElButton>
              <ElButton @click="actions.shift()">shift</ElButton>
              <ElButton @click="actions.swap(0, fields.length - 1)">swap</ElButton>
            </ElSpace>
          </template>
        </ArrayField>

        <ElDivider content-position="center">(布局样式) 提交</ElDivider>
        <FormItem>
          <ElButton @click="print">submit</ElButton>
          <ElButton @click="validate">validate</ElButton>
          <ElButton type="danger" @click="reset">reset</ElButton>
        </FormItem>
      </Form>
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  .el-card {
    width: 800px;
  }
}
</style>
