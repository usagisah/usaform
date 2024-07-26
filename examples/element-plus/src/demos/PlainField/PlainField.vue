<script lang="ts" setup>
import { createForm, exportFormStructJson, PlainField } from "@shoroi/form"
import { ElButton, ElCard, ElCheckbox, ElDatePicker, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioGroup, ElSelect } from "element-plus"
import {} from "vue"

const [DemoKeyForm, keyFormAction] = createForm()
const [DemoSlotForm, slotFormAction] = createForm()

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
        <PlainField
          name="input"
          element="ElInput"
          :props="{ placeholder: '请输入' }"
          :layoutProps="{ label: '文本输入', rules: [{ required: true, type: 'string', min: 1, message: '该字段不能为空' }] }"
        />
        <PlainField name="select" element="ElSelect" :props="{ placeholder: '请选择', clearable: true }" :layoutProps="{ label: '下拉选择' }">
          <ElOption value="1" label="烤鸭" />
          <ElOption value="2" label="烧鸡" />
          <ElOption value="3" label="汉堡" />
        </PlainField>
        <PlainField name="number" :initValue="99" element="ElInputNumber" :layoutProps="{ label: '数字输入' }" />
        <PlainField name="radio" :initValue="2" element="ElRadioGroup" :layoutProps="{ label: '单选选择' }">
          <ElRadio :value="1">Option 1</ElRadio>
          <ElRadio :value="2">Option 2</ElRadio>
        </PlainField>
        <PlainField name="checkbox" element="ElCheckbox" :layoutProps="{ label: '多选选择' }" />
        <PlainField name="datePicker" element="ElDatePicker" :props="{ placeholder: '请选择' }" :layoutProps="{ label: '日期选择' }" />

        <ElButton @click="validate()">校验</ElButton>
        <ElButton @click="reset()">清空</ElButton>
        <ElButton @click="printJson()">打印json</ElButton>
        <ElButton @click="submit()">提交</ElButton>
      </DemoKeyForm>
    </ElCard>

    <ElCard style="width: 45%">
      <template #header>内联插槽</template>
      <DemoSlotForm>
        <PlainField name="input" :layoutProps="{ label: '文本输入', rules: [{ required: true, type: 'string', min: 1, message: '该字段不能为空' }] }">
          <template #default="{ bind }">
            <ElInput v-bind="bind" placeholder="请输入" />
          </template>
        </PlainField>
        <PlainField name="select" :layoutProps="{ label: '下拉选择' }">
          <template #default="{ bind }">
            <ElSelect v-bind="bind" placeholder="请选择" clearable>
              <ElOption value="1" label="烤鸭" />
              <ElOption value="2" label="烧鸡" />
              <ElOption value="3" label="汉堡" />
            </ElSelect>
          </template>
        </PlainField>
        <PlainField name="number" :initValue="99" :layoutProps="{ label: '数字输入' }">
          <template #default="{ bind }">
            <ElInputNumber v-bind="bind" />
          </template>
        </PlainField>
        <PlainField name="radio" :initValue="2" :layoutProps="{ label: '单选选择' }">
          <template #default="{ bind }">
            <ElRadioGroup v-bind="bind">
              <ElRadio :value="1">Option 1</ElRadio>
              <ElRadio :value="2">Option 2</ElRadio>
            </ElRadioGroup>
          </template>
        </PlainField>
        <PlainField name="checkbox" :layoutProps="{ label: '多选选择' }">
          <template #default="{ bind }">
            <ElCheckbox v-bind="bind" />
          </template>
        </PlainField>
        <PlainField name="datePicker" element="ElDatePicker" :props="{ placeholder: '请选择' }" :layoutProps="{ label: '日期选择' }">
          <template #default="{ bind }">
            <ElDatePicker v-bind="bind" />
          </template>
        </PlainField>

        <ElButton @click="validate()">校验</ElButton>
        <ElButton @click="reset()">清空</ElButton>
        <ElButton @click="submit()">提交</ElButton>
      </DemoSlotForm>
    </ElCard>
  </div>
</template>
