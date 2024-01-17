<script lang="ts" setup>
import { CFormConfig, CFormExpose, Form, FormItem, PlainField, useFormPlainField } from "@usaform/element-plus"
import { ElButton, ElCard, ElCol, ElInput, ElOption, ElRow, ElSelect, ElSpace } from "element-plus"
import { ref } from "vue"

const defaultData = { id: "", name: "", type: "0" }
const { fieldValue } = useFormPlainField("search", () => {
  return { initValue: defaultData }
})
const formConfig: CFormConfig = { defaultFormData: defaultData }

const form = ref<CFormExpose>()
const onSearch = () => {
  fieldValue.value = form.value!.getFormData() as any
}
const onReset = () => {
  fieldValue.value = defaultData
}
</script>

<template>
  <Form ref="form" :config="formConfig">
    <ElCard style="width: 95vw">
      <ElRow :gutter="24">
        <ElCol :span="8">
          <PlainField name="id" layout="FormItem" :layout-props="{ label: '订单 ID' }">
            <template #default="{ bind }">
              <ElInput v-bind="bind" placeholder="请输出订单 ID" style="width: 100%" />
            </template>
          </PlainField>
        </ElCol>
        <ElCol :span="8">
          <PlainField name="name" layout="FormItem" :layout-props="{ label: '订单名称' }">
            <template #default="{ bind }">
              <ElInput v-bind="bind" placeholder="请输入订单名称" style="width: 100%" />
            </template>
          </PlainField>
        </ElCol>
        <ElCol :span="8">
          <PlainField name="type" layout="FormItem" :layout-props="{ label: '订单类型' }">
            <template #default="{ bind }">
              <ElSelect v-bind="bind" placeholder="请选择订单类型" style="width: 100%">
                <ElOption label="全部订单" value="0" />
                <ElOption label="已收订单" value="1" />
                <ElOption label="退款订单" value="2" />
                <ElOption label="过期订单" value="3" />
              </ElSelect>
            </template>
          </PlainField>
        </ElCol>
        <ElCol :span="8">
          <FormItem>
            <ElButton type="primary" @click="onSearch">查询</ElButton>
            <ElButton @click="onReset">重置</ElButton>
          </FormItem>
        </ElCol>
      </ElRow>
    </ElCard>
  </Form>
</template>

<style lang="scss" scoped></style>
