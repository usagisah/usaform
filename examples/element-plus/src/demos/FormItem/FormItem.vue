<script lang="ts" setup>
import { createForm, exportFormStructJson, PlainField } from "@shoroi/form"
import { ElButton, ElCard } from "element-plus"
import {} from "vue"
import { FunLabelComponent, VueLabelComponent } from "./components/Label"

const [Form, form] = createForm({
  config: {
    Rules: {
      notNull(param) {
        console.log( "rule-value", param )
        return {
          trigger: "blur",
          required: true,
          message: "该字段不能为空",
          validator(fieldValue, options) {
            console.log( "rule-validator", fieldValue, options, options.actions.getFormData() )
            return fieldValue !== undefined
          }
        }
      }
    }
  }
})

const submit = () => {
  console.log(form.value?.getFormData())
}
const validate = async () => {
  console.log(await form.value?.validate())
}
const reset = () => {
  form.value?.reset()
}
const printJson = () => {
  console.log(exportFormStructJson(form.value!.field))
}
</script>

<template>
  <div style="display: flex; justify-content: center; gap: 1rem">
    <ElCard style="width: 60%">
      <template #header>FormItem 控制器参数</template>
      <Form>
        <!-- label -->
        <PlainField key="label1" element="ElInput" :layoutProps="{ label: '一般标题' }" />
        <PlainField key="label2" element="ElInput" :layoutProps="{ label: FunLabelComponent }" />
        <PlainField key="label3" element="ElInput" :layoutProps="{ label: VueLabelComponent }" />

        <!-- labelWidth -->
        <PlainField key="labelWidth-300px" element="ElInput" :layoutProps="{ label: '标题尺寸300px', labelWidth: '300px' }" />

        <!-- size -->
        <PlainField key="size-large" element="ElInput" :layoutProps="{ label: '尺寸-large', size: 'large' }" />
        <PlainField key="size-default" element="ElInput" :layoutProps="{ label: '尺寸-default', size: 'default' }" />
        <PlainField key="size-small" element="ElInput" :layoutProps="{ label: '尺寸-small', size: 'small' }" />

        <!-- disabled -->
        <PlainField key="disabled-true" element="ElInput" :layoutProps="{ label: '禁用', disabled: true }" />

        <!-- 布局模式 mode -->
        <PlainField key="mode-left" element="ElInput" :layoutProps="{ label: '布局-left', labelWidth: '200px', mode: 'left' }" />
        <PlainField key="mode-right" element="ElInput" :layoutProps="{ label: '布局-right', labelWidth: '200px', mode: 'right' }" />
        <PlainField key="mode-top" element="ElInput" :layoutProps="{ label: '布局-top', labelWidth: '200px', mode: 'top' }" />

        <!-- 行内元素 inline -->
        <PlainField key="inline1-true" element="ElInput" :props="{ style: 'width:180px' }" :layoutProps="{ label: '行内元素-inline-true', inline: true }" />
        <PlainField key="inline2-true" element="ElInput" :props="{ style: 'width:180px' }" :layoutProps="{ label: '行内元素-inline-true', inline: true }" />

        <!-- rules -->
        <PlainField key="rule-inline" element="ElInput" :layoutProps="{ label: '行内校验', rules: [{ required: true, type: 'string', min: 1, message: '该字段不能为空' }] }" />
        <PlainField key="rule-ref" element="ElInput" :layoutProps="{ label: '引用校验', rules: [['notNull']] }" />
        <PlainField key="rule-ref-value" element="ElInput" :layoutProps="{ label: '引用传参', rules: [['notNull', 'change']] }" />

        <!-- other attr -->
        <PlainField key="other attr" element="ElInput" :layout-props="{ label: '自由传参' }" class="customClass" @click="console.log($event, 'other attr click')" />

        <ElButton @click="validate">校验</ElButton>
        <ElButton @click="reset">清空</ElButton>
        <ElButton @click="printJson">打印json</ElButton>
        <ElButton @click="submit">提交</ElButton>
      </Form>
    </ElCard>
  </div>
</template>
