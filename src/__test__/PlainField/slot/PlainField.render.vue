<script lang="ts" setup>
import { createForm, PlainField } from "@shoroi/form"
import { ElCheckbox, ElDatePicker, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioGroup, ElSelect } from "element-plus"

const props = defineProps<{
  inputInitValue?: string
  inputErrorMessage?: string
}>()

const [SlotForm, SlotFormActions] = createForm()
defineExpose({ actions: SlotFormActions })
</script>

<template>
  <SlotForm>
    <PlainField
      key="input"
      :initValue="props.inputInitValue"
      :layoutProps="{ label: '文本输入', rules: [{ required: true, type: 'string', min: 1, message: props.inputErrorMessage ?? '该字段不能为空' }] }"
    >
      <template #default="{ bind }">
        <ElInput v-bind="bind" class="input" />
      </template>
    </PlainField>

    <PlainField key="select" multiple :layoutProps="{ label: '下拉选择' }">
      <template #default="{ bind }">
        <ElSelect v-bind="bind" class="select" placeholder="请选择" clearable>
          <ElOption value="1" label="烤鸭" />
          <ElOption value="2" label="烧鸡" />
          <ElOption value="3" label="汉堡" />
        </ElSelect>
      </template>
    </PlainField>

    <PlainField key="inputNumber" :layoutProps="{ label: '数字输入' }">
      <template #default="{ bind }">
        <ElInputNumber v-bind="bind" class="inputNumber" />
      </template>
    </PlainField>

    <PlainField key="radio" :initValue="2" :layoutProps="{ label: '单选选择' }">
      <template #default="{ bind }">
        <ElRadioGroup v-bind="bind" class="radio">
          <ElRadio :value="1">Option 1</ElRadio>
          <ElRadio :value="2">Option 2</ElRadio>
        </ElRadioGroup>
      </template>
    </PlainField>

    <PlainField key="checkbox" :layoutProps="{ label: '多选选择' }">
      <template #default="{ bind }">
        <ElCheckbox v-bind="bind" class="checkbox" />
      </template>
    </PlainField>

    <PlainField key="datePicker" :props="{ placeholder: '请选择' }" :layoutProps="{ label: '日期选择' }">
      <template #default="{ bind }">
        <ElDatePicker v-bind="bind" class="datePicker" />
      </template>
    </PlainField>
  </SlotForm>
</template>
