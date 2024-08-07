<script lang="tsx" setup>
import { ElSelect, ElOption, ElInput, ElRadio, ElRadioGroup, ElCheckbox, ElCheckboxGroup, ElInputNumber, ElDivider, ElCard, ElButton, ElDatePicker, ElCascader, ElSpace } from "element-plus"
import { createForm, FormItem, PlainField } from "@usaform/element-plus"

const CascaderOptions = [
  {
    value: "guide",
    label: "Guide",
    children: [
      {
        value: "disciplines",
        label: "Disciplines",
        children: [
          {
            value: "consistency",
            label: "Consistency"
          },
          {
            value: "feedback",
            label: "Feedback"
          },
          {
            value: "efficiency",
            label: "Efficiency"
          },
          {
            value: "controllability",
            label: "Controllability"
          }
        ]
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          {
            value: "side nav",
            label: "Side Navigation"
          },
          {
            value: "top nav",
            label: "Top Navigation"
          }
        ]
      }
    ]
  },
  {
    value: "component",
    label: "Component",
    children: [
      {
        value: "basic",
        label: "Basic",
        children: [
          {
            value: "layout",
            label: "Layout"
          },
          {
            value: "color",
            label: "Color"
          },
          {
            value: "typography",
            label: "Typography"
          },
          {
            value: "icon",
            label: "Icon"
          },
          {
            value: "button",
            label: "Button"
          }
        ]
      },
      {
        value: "form",
        label: "Form",
        children: [
          {
            value: "radio",
            label: "Radio"
          },
          {
            value: "checkbox",
            label: "Checkbox"
          },
          {
            value: "input",
            label: "Input"
          },
          {
            value: "input-number",
            label: "InputNumber"
          },
          {
            value: "select",
            label: "Select"
          },
          {
            value: "cascader",
            label: "Cascader"
          },
          {
            value: "switch",
            label: "Switch"
          },
          {
            value: "slider",
            label: "Slider"
          },
          {
            value: "time-picker",
            label: "TimePicker"
          },
          {
            value: "date-picker",
            label: "DatePicker"
          },
          {
            value: "datetime-picker",
            label: "DateTimePicker"
          },
          {
            value: "upload",
            label: "Upload"
          },
          {
            value: "rate",
            label: "Rate"
          },
          {
            value: "form",
            label: "Form"
          }
        ]
      },
      {
        value: "data",
        label: "Data",
        children: [
          {
            value: "table",
            label: "Table"
          },
          {
            value: "tag",
            label: "Tag"
          },
          {
            value: "progress",
            label: "Progress"
          },
          {
            value: "tree",
            label: "Tree"
          },
          {
            value: "pagination",
            label: "Pagination"
          },
          {
            value: "badge",
            label: "Badge"
          }
        ]
      },
      {
        value: "notice",
        label: "Notice",
        children: [
          {
            value: "alert",
            label: "Alert"
          },
          {
            value: "loading",
            label: "Loading"
          },
          {
            value: "message",
            label: "Message"
          },
          {
            value: "message-box",
            label: "MessageBox"
          },
          {
            value: "notification",
            label: "Notification"
          }
        ]
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          {
            value: "menu",
            label: "Menu"
          },
          {
            value: "tabs",
            label: "Tabs"
          },
          {
            value: "breadcrumb",
            label: "Breadcrumb"
          },
          {
            value: "dropdown",
            label: "Dropdown"
          },
          {
            value: "steps",
            label: "Steps"
          }
        ]
      },
      {
        value: "others",
        label: "Others",
        children: [
          {
            value: "dialog",
            label: "Dialog"
          },
          {
            value: "tooltip",
            label: "Tooltip"
          },
          {
            value: "popover",
            label: "Popover"
          },
          {
            value: "card",
            label: "Card"
          },
          {
            value: "carousel",
            label: "Carousel"
          },
          {
            value: "collapse",
            label: "Collapse"
          }
        ]
      }
    ]
  },
  {
    value: "resource",
    label: "Resource",
    children: [
      {
        value: "axure",
        label: "Axure Components"
      },
      {
        value: "sketch",
        label: "Sketch Templates"
      },
      {
        value: "docs",
        label: "Design Documentation"
      }
    ]
  }
]

const [FormSlot, formSlotRef] = createForm()
const callSlot = async (key: string) => {
  console.log(await formSlotRef.value![key]())
}

const [FormKey, formKeyRef] = createForm({ config: { plainFieldController: "FormItem" } })
const callKey = async (key: string) => console.log(await formKeyRef.value![key]())

const customLabel = (attrs: any) => <div {...attrs}>时间</div>
</script>

<template>
  <ElSpace>
    <ElCard>
      <template #header>插槽</template>
      <FormSlot>
        <ElDivider content-position="center">(布局样式) 基本表单元素</ElDivider>
        <PlainField name="input" layout="FormItem" :layout-props="{ label: '名称', labelWidth: '60px', mode: 'left', rules: [{ trigger: 'blur', required: true, message: '该字段是必填的' }] }">
          <template #default="{ bind }">
            <ElInput v-bind="bind" placeholder="请输入名称" />
          </template>
        </PlainField>
        <PlainField name="number" layout="FormItem" :layout-props="{ label: '数量', labelWidth: '60px', mode: 'right' }" :init-value="10">
          <template #default="{ bind }">
            <ElInputNumber v-bind="bind" placeholder="请输入数量" />
          </template>
        </PlainField>
        <PlainField name="select" layout="FormItem" :layout-props="{ label: '下拉', mode: 'top', disabled: true }">
          <template #default="{ bind }">
            <ElSelect v-bind="bind" placeholder="请选择">
              <ElOption label="1" value="1" />
              <ElOption label="2" value="2" />
              <ElOption label="3" value="3" />
            </ElSelect>
          </template>
        </PlainField>
        <PlainField name="radio" layout="FormItem" :layout-props="{ label: '按钮', labelWidth: '60px' }">
          <template #default="{ bind }">
            <el-radio-group v-bind="bind">
              <el-radio value="1" size="large">Option 1</el-radio>
              <el-radio value="2" size="large">Option 2</el-radio>
            </el-radio-group>
          </template>
        </PlainField>
        <PlainField name="Cascader" layout="FormItem" :layout-props="{ label: '级联', labelWidth: '60px' }">
          <template #default="{ bind }">
            <ElCascader v-bind="bind" :options="CascaderOptions" :props="{ expandTrigger: 'hover' }" />
          </template>
        </PlainField>
        <PlainField name="Checkbox" layout="FormItem" :layout-props="{ label: '多选', labelWidth: '60px' }">
          <template #default="{ bind }">
            <el-checkbox-group v-bind="bind">
              <el-checkbox label="Option A" value="Option A" />
              <el-checkbox label="Option B" value="Option B" />
              <el-checkbox label="Option C" value="Option C" />
              <el-checkbox label="disabled" value="disabled" disabled />
              <el-checkbox label="selected and disabled" value="selected and disabled" disabled />
            </el-checkbox-group>
          </template>
        </PlainField>
        <PlainField name="DatePicker" :layout="FormItem" :layout-props="{ label: customLabel, labelWidth: '60px' }">
          <template #default="{ bind }">
            <ElDatePicker v-bind="bind" type="date" placeholder="Pick a day" />
          </template>
        </PlainField>

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
      </FormKey>
    </ElCard>
  </ElSpace>
</template>
