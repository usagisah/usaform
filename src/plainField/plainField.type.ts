import { Component, HTMLAttributes, ShallowRef } from "vue"
import { FormBaseActions } from "../actions/hooks"
import { CFormItemProps } from "../controller/FormItem.type"
import { CFormRuleItem } from "../controller/rule"
import { BaseFiled, FieldToJson } from "../form/field.type"
import { FormConfig } from "../form/form.type"
import { Obj } from "../shared/type"
import { FieldValue } from "../shared/useFieldValue"

export type PlainField = BaseFiled &
  FieldValue & {
    type: "plain"
    userConfig: Obj
  }

export type PlainFieldInitInfo = {
  initValue: unknown
  formConfig: FormConfig
}

export type PlainFieldActions = FormBaseActions
export type PlainFieldConfig<T = unknown> = {
  initValue?: T
  toJson?: FieldToJson
  [x: string]: any
}
export type PlainFieldInit<T> = (info: PlainFieldInitInfo) => PlainFieldConfig<T>

export interface CPlainFieldProps extends HTMLAttributes, Obj {
  name: string | number

  // 初始值
  initValue?: any

  // 双向绑定的 key
  modelValue?: string

  layout?: string | Component
  layoutProps?: CFormItemProps

  element?: string | Component
  props?: Obj

  slots?: Record<string, Component | string>
}

export interface CPlainFieldLayoutInfo {
  type: "plain"
  fieldValue: ShallowRef<any>
  actions: PlainFieldActions
  Rules: Record<string, (value: any) => CFormRuleItem>
  props: Obj
  layoutProps: CFormItemProps
  children: (p: { bind: Obj; props: Obj }) => any
  fieldAttrs: HTMLAttributes & Obj
  formConfig: FormConfig
}
