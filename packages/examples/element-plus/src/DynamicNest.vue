<script lang="ts" setup>
import { provide, reactive, ref } from "vue"
import { ElInput, ElSelect, ElInputNumber, ElDivider, ElCard, ElButton, ElDatePicker } from "element-plus"
import { Form, FormConfig, FormItem, FormExpose, ArrayField } from "@usaform/element-plus"
import DynamicGroup from "./dynamic/DynamicNest.Group.vue"
import DynamicItem from "./dynamic/DynamicNest.Item.vue"
import DynamicType from "./dynamic/DynamicNest.Type.vue"
import DynamicOperate from "./dynamic/DynamicNest.Operate.vue"
import DynamicValue from "./dynamic/DynamicNest.Value.vue"

const fetchData = reactive({
  types: [
    { id: 1, title: "乘除法" },
    { id: 2, title: "加减法" }
  ],
  operates: {
    1: ["*", "/"],
    2: ["+", "-"]
  }
})
provide("formData", fetchData)
const formConfig: FormConfig = {
  Elements: { ElInput, ElSelect, FormItem, ElInputNumber, ElDatePicker, DynamicType, DynamicOperate, DynamicValue, DynamicGroup, DynamicItem },
  defaultFormData: {
    group: [
      {
        groupId: 1,
        children: [
          {
            itemId: 11,
            children: {
              type: 1,
              operate: "*",
              value: ""
            }
          }
        ]
      }
    ]
  }
}
const form = ref<FormExpose | null>(null)
setTimeout(() => {
  form.value!.set("group", [
    {
      groupId: 1,
      children: [
        {
          itemId: 11,
          children: {
            type: 2,
            operate: "+",
            value: ""
          }
        }
      ]
    }
  ])
}, 5000)

const print = () => {
  console.log(form.value!.getFormData())
}
const validate = async () => {
  console.log(await form.value!.validate())
}
const reset = () => {
  form.value!.reset()
}
</script>

<template>
  <div class="form">
    <ElCard>
      <Form :config="formConfig" ref="form">
        <ArrayField name="group" element="DynamicGroup" />

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
    width: 1000px;
    margin-top: -200px;
  }
}
</style>
