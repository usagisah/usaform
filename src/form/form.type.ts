import { ValidateOption } from "async-validator"
import { Component, MaybeRef } from "vue"
import { FormBaseActions } from "../actions/hooks"
import { CFormItemProps } from "../controller/FormItem.type"
import { CFormRuleItem, CFormValidateError } from "../controller/rule"
import { Obj } from "../shared/type"
import { FieldToJson, RootField } from "./field.type"

export type FormConfig = {
  defaultFormData?: Obj
  arrayUnwrapKey?: string | string[]
  toJson?: FieldToJson
} & Obj

export type FormActions = FormBaseActions & {
  provide: () => void
}

export interface CFormConfig extends FormConfig {
  // 默认使用的表单布局组件
  defaultFormLayout?: string | Component
  // 默认使用的控制器
  plainFieldController?: string | Component
  objectFieldController?: string | Component
  arrayFieldController?: string | Component
  // 全局布局参数
  layoutProps?: MaybeRef<CFormItemProps>
  // 双向绑定的 key
  modelValue?: string
  // 用于指定 key 的元素
  Elements?: MaybeRef<Record<string, Component>>
  // 默认的校验选项
  defaultValidateOption?: ValidateOption
  // 用于指定 key 的规则
  Rules?: MaybeRef<Record<string, (value: any) => CFormRuleItem>>
}

export interface CFormProps {
  config?: CFormConfig
  layout?: string | Component
  layoutProps?: Obj
  dynamic?: boolean
}

export interface CFormExpose extends Omit<FormActions, "provide"> {
  validate: () => Promise<CFormValidateError[]>
  reset: () => void
  callLayout: (path: string, key: string, ...params: any[]) => Record<string, any>
  callElement: (path: string, key: string, ...params: any[]) => Record<string, any>
  field: RootField
}
