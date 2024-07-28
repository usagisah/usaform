<script lang="ts" setup>
import { ArrayField, PlainField, createForm, exportFormStructJson } from "@shoroi/form"
import { ElButton, ElCard, ElDivider, ElInput, ElSpace } from "element-plus"
import DemoArrayKey from "./components/DemoArrayKey.vue"

const [DemoKeyForm, keyFormAction] = createForm({ config: { Elements: { DemoArrayKey }, layoutProps: { labelWidth: "80px" } } })
const [DemoSlotForm, slotFormAction] = createForm({ config: { layoutProps: { labelWidth: "80px" } } })

const submit = (isKey = true) => {
  console.log((isKey ? keyFormAction : slotFormAction).value?.getFormData())
}
const validate = async (isKey = true) => {
  console.log(await (isKey ? keyFormAction : slotFormAction).value?.validate())
}
const reset = (isKey = true) => {
  ;(isKey ? keyFormAction : slotFormAction).value?.reset()
}
const printJson = () => {
  console.log(exportFormStructJson(keyFormAction.value!.field))
}
</script>

<template>
  <div style="display: flex; justify-content: center; gap: 1rem">
    <ElCard style="width: 45%">
      <template #header>指定key</template>
      <DemoKeyForm>
        <ArrayField name="array" element="DemoArrayKey" />
      </DemoKeyForm>

      <ElDivider>提交操作</ElDivider>
      <ElButton @click="validate()">校验</ElButton>
      <ElButton @click="reset()">清空</ElButton>
      <ElButton @click="printJson()">打印json</ElButton>
      <ElButton @click="submit()">提交</ElButton>
    </ElCard>

    <ElCard style="width: 45%">
      <template #header>内联插槽</template>
      <DemoSlotForm>
        <ArrayField name="array">
          <template #default="{ value, actions }">
            <div v-for="(item, i) in value" :key="item.id">
              <PlainField :name="i" layout="FormItem" :layout-props="{ label: '名称' }">
                <template #default="{ bind }">
                  <ElInput v-bind="bind" placeholder="请输入名称" />
                </template>
              </PlainField>
            </div>
            <ElSpace>
              <ElButton @click="actions.push({ id: Math.random(), value: value.length })">尾部添加</ElButton>
              <ElButton @click="actions.pop()">尾部删除</ElButton>
              <ElButton @click="actions.unshift({ id: Math.random(), value: value.length })">头部添加</ElButton>
              <ElButton @click="actions.shift()">头部删除</ElButton>
              <ElButton @click="actions.swap(0, value.length - 1)" v-if="value.length >= 2">首尾交换</ElButton>
            </ElSpace>
          </template>
        </ArrayField>
      </DemoSlotForm>

      <ElDivider>提交操作</ElDivider>
      <ElButton @click="validate()">校验</ElButton>
      <ElButton @click="reset()">清空</ElButton>
      <ElButton @click="submit()">提交</ElButton>
    </ElCard>
  </div>
</template>
