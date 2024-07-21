<script lang="ts" setup>
import { h } from "vue"
import { createForm, FormItem, PlainField } from "@usaform/element-plus"
import { ElButton, ElCard, ElOption, ElSelect, ElSpace } from "element-plus"
import Append from "./Append.vue"

const [Form, form] = createForm({ config: { plainFieldController: FormItem } })
const onSubmit = () => console.log(form.value?.getFormData())

const PrependComp = () => [h("div", "prepend")]
</script>

<template>
  <ElCard style="min-width: 600px">
    <Form>
      <PlainField name="select" element="InnerSelect" :props="{ style: 'width:100%' }" :layoutProps="{ label: '内联元素' }" />
      <template #InnerSelect="{ actions, ...bind }">
        <ElSelect v-bind="bind">
          <ElOption label="a" value="1" />
          <ElOption label="b" value="2" />
        </ElSelect>
      </template>

      <!-- 外部插槽需要显示指定，内部插槽会自动传递 -->
      <PlainField name="input" element="ElInput" :props="{ style: 'width:100%' }" :layoutProps="{ label: '传递插槽' }" :slots="{ suffix: 'InputSuffix', prepend: PrependComp, append: Append }">
        <template #prefix>prefix-slot</template>
      </PlainField>
      <template #InputSuffix>
        <span>suffix-slot</span>
      </template>
    </Form>

    <ElSpace>
      <ElButton type="primary" @click="onSubmit">submit</ElButton>
    </ElSpace>
  </ElCard>
</template>
