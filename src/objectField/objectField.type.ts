import { ShallowRef } from "vue"
import { FormBaseActions } from "../actions/hooks"
import { CFormItemProps } from "../controller/FormItem.type"
import { CFormRuleItem } from "../controller/rule"
import { BaseFiled, Field, FieldName, FieldToJson } from "../form/field.type"
import { CFormConfig, FormConfig } from "../form/form.type"
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

export interface CObjectFieldProps {
  name: string | number

  initValue?: any

  layout?: string | Record<any, any>
  layoutProps?: CFormItemProps

  element?: string | Record<any, any>
  props?: Record<any, any>
}

export interface CObjectFieldLayoutInfo {
  type: "object"
  fieldValue: ShallowRef<any>
  actions: ObjectFieldActions
  Rules: Record<any, (value: any) => CFormRuleItem>
  props: Obj
  layoutProps: CFormItemProps
  formConfig: CFormConfig
  fieldProps: Obj
  children: (p: { bind: Obj; props: Obj }) => any
}
