import { Component, HTMLAttributes, ShallowRef } from "vue"
import { FormBaseActions } from "../actions/hooks"
import { CFormItemProps } from "../controller/FormItem.type"
import { CFormRuleItem } from "../controller/rule"
import { BaseFiled, Field, FieldName, FieldToJson } from "../form/field.type"
import { FormConfig } from "../form/form.type"
import { Obj } from "../shared/type"
import { FieldValue } from "../shared/useFieldValue"

export type ObjectField = BaseFiled &
  FieldValue & {
    type: "object"
    struct: Map<FieldName, Field>
    userConfig: Obj
  }

export type ObjectFieldInitInfo = {
  initValue: unknown
  formConfig: FormConfig
}

export type ObjectFieldActions = FormBaseActions
export type ObjectFieldConfig<T = unknown> = { initValue?: T; toJson?: FieldToJson }
export type ObjectFieldInit<T> = (info: ObjectFieldInitInfo) => ObjectFieldConfig<T>

export interface CObjectFieldProps extends HTMLAttributes, Obj {
  name: string | number

  initValue?: any

  layout?: string | Component
  layoutProps?: CFormItemProps

  element?: string | Component
  props?: Obj
}

export interface CObjectFieldLayoutInfo {
  type: "object"
  fieldValue: ShallowRef<any>
  actions: ObjectFieldActions
  Rules: Record<string, (value: any) => CFormRuleItem>
  props: Obj
  layoutProps: CFormItemProps
  formConfig: FormConfig
  fieldAttrs: HTMLAttributes & Obj
  children: (p: { bind: Obj; props: Obj }) => any
}
