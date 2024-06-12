<script lang="tsx" setup>
import { ref } from "vue"
import { Space, Card, Input, InputNumber, Button, Select, CheckboxGroup, DatePicker, Divider, RadioGroup, Checkbox } from "ant-design-vue"
import { Form, FormItem, PlainField, CFormExpose } from "@usaform/element-plus"

const formSlot = ref<CFormExpose | null>(null)
const callSlot = async (key: string) => {
  console.log(await formSlot.value![key]())
}
const formKey = ref<CFormExpose | null>(null)
const callKey = async (key: string) => console.log(await formKey.value![key]())

const customLabel = (attrs: any) => <div {...attrs}>自定义标题:时间</div>
</script>

<template>
  <Space>
    <Card title="插槽" style="width: 600px;">
      <Form ref="formSlot">
        <Divider content-position="center">(布局样式) 基本表单元素</Divider>

        <PlainField name="input" layout="FormItem" :layout-props="{ label: '名称', labelWidth: '60px', mode: 'left', rules: [{ trigger: 'blur', required: true, message: '该字段是必填的' }] }">
          <template #default="{ bind }">
            <Input v-bind="bind" placeholder="请输入名称" />
          </template>
        </PlainField>

        <PlainField name="number" layout="FormItem" :layout-props="{ label: '数量', labelWidth: '60px', mode: 'right' }" :init-value="10">
          <template #default="{ bind }">
            <InputNumber v-bind="bind" placeholder="请输入数量" />
          </template>
        </PlainField>

        <PlainField name="select" layout="FormItem" :layout-props="{ label: '下拉', mode: 'top' }">
          <template #default="{ bind }">
            <Select
              v-bind="bind"
              placeholder="请选择"
              style="width: 100%;"
              :options="[
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 }
              ]"
            >
            </Select>
          </template>
        </PlainField>

        <PlainField name="radio" layout="FormItem" :layout-props="{ label: '按钮', labelWidth: '60px' }">
          <template #default="{ bind }">
            <RadioGroup v-bind="bind" :options="[{ label: 'o1', value: '1' }, { label: 'o2', value: '2' }]">
            </RadioGroup>
          </template>
        </PlainField>

        <PlainField name="Checkbox" layout="FormItem" :layout-props="{ label: '多选', labelWidth: '60px' }">
          <template #default="{ bind }">
            <CheckboxGroup v-bind="bind" :options="['A', 'B', 'C']"
            </CheckboxGroup>
          </template>
        </PlainField>

        <PlainField name="singleCheckbox" layout="FormItem" :layout-props="{ label: '不同的VModal', labelWidth: '60px' }" modelValue="checked">
          <template #default="{ bind }">
            <Checkbox v-bind="bind"></Checkbox>
          </template>
        </PlainField>
        

        <PlainField name="DatePicker" :layout="FormItem" :layout-props="{ label: customLabel, labelWidth: '60px' }">
          <template #default="{ bind }">
            <DatePicker v-bind="bind" type="date" placeholder="Pick a day" />
          </template>
        </PlainField>

        <Divider content-position="center">(布局样式) 提交</Divider>
        <FormItem>
          <Button @click="callSlot('getFormData')">submit</Button>
          <Button @click="callSlot('validate')">validate</Button>
          <Button @click="callSlot('reset')">reset</Button>
        </FormItem>
      </Form>
    </Card>

    <!-- <ElCard>
      <template #header>指定 key</template>
      <Form ref="formKey" :config="{ plainFieldController: 'FormItem' }">
        <ElDivider content-position="center">(布局样式) 基本表单元素</ElDivider>
        <PlainField name="input" :layout-props="{ label: '名称' }" element="ElInput" :props="{ placeholder: '请输入名称' }" />
        <PlainField name="number" :layout-props="{ label: '数量' }" element="ElInputNumber" :props="{ placeholder: '请输入数量' }" />
        <PlainField name="select" :layout-props="{ label: '下拉' }" element="Select" :props="{ placeholder: '请选择' }" />
        <PlainField name="radio" :layout-props="{ label: '按钮' }" element="Radio" />
        <PlainField name="Cascader" :layout-props="{ label: '级联' }" element="ElCascader" :props="{ options: CascaderOptions, props: { expandTrigger: 'hover' } }" />
        <PlainField name="Checkbox" layout="FormItem" :layout-props="{ label: '多选' }" element="Checkbox" />
        <PlainField name="DatePicker" :layout="FormItem" :layout-props="{ label: '时间' }" element="ElDatePicker" :props="{ type: 'date', placeholder: 'Pick a day' }" />

        <ElDivider content-position="center">(布局样式) 提交</ElDivider>
        <FormItem>
          <ElButton @click="callKey('getFormData')">submit</ElButton>
          <ElButton @click="callKey('validate')">validate</ElButton>
          <ElButton @click="callKey('reset')">reset</ElButton>
        </FormItem>
      </Form>
    </ElCard> -->
  </Space>
</template>
