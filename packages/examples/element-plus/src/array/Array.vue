<script lang="ts" setup>
import { ElInput, ElDivider, ElCard, ElButton, ElSpace } from "element-plus"
import { createForm, FormItem, PlainField, CFormExpose, ArrayField, exportFormStructJson } from "@usaform/element-plus"
import ArrayKey from "./Array.slot.vue"

const [FormSlot, formSlot] = createForm()
const callSlot = async (key: string) => console.log(await formSlot.value![key]())

const [FormKey, formKey] = createForm({ config: { Elements: { ArrayKey } } })
const callKey = async (key: string) => console.log(await formKey.value![key]())

const printJson = () => {
  console.log(exportFormStructJson(formKey.value!.field))
}
</script>

<template>
  <ElSpace>
    <ElCard>
      <template #header>插槽</template>
      <FormSlot>
        <ArrayField name="array">
          <template #default="{ fieldValue, actions }">
            <div v-for="(item, i) in fieldValue" :key="item.id">
              <PlainField :name="i" layout="FormItem" :layout-props="{ label: '名称' }">
                <template #default="{ bind }">
                  <ElInput v-bind="bind" placeholder="请输入名称" />
                </template>
              </PlainField>
            </div>
            <ElSpace>
              <ElButton @click="actions.push({ id: Math.random(), value: '11111111' })">尾部添加</ElButton>
              <ElButton @click="actions.pop()">尾部删除</ElButton>
              <ElButton @click="actions.unshift({ id: Math.random(), value: '2222' })">头部添加</ElButton>
              <ElButton @click="actions.shift()">头部删除</ElButton>
              <ElButton @click="actions.swap(0, fieldValue.length - 1)" v-if="fieldValue.length >= 2">首尾交换</ElButton>
            </ElSpace>
          </template>
        </ArrayField>

        <ElDivider content-position="center">(布局样式) 提交</ElDivider>
        <FormItem>
          <ElButton @click="callSlot('getFormData')">submit</ElButton>
          <ElButton @click="callSlot('validate')">validate</ElButton>
          <ElButton @click="callSlot('reset')">reset</ElButton>
        </FormItem>
      </FormSlot>
    </ElCard>

    <ElCard>
      <template #header>指定 key</template>
      <FormKey>
        <ArrayField name="array" element="ArrayKey" />
        <ElDivider content-position="center">(布局样式) 提交</ElDivider>
        <FormItem>
          <ElButton @click="callKey('getFormData')">submit</ElButton>
          <ElButton @click="callKey('validate')">validate</ElButton>
          <ElButton @click="callKey('reset')">reset</ElButton>
          <ElButton @click="printJson">printJson</ElButton>
        </FormItem>
      </FormKey>
    </ElCard>
  </ElSpace>
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
