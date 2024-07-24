import { ShallowRef } from "vue"
import { FormBaseActions } from "../actions/hooks"
import { CFormItemProps } from "../controller/FormItem.type"
import { CFormRuleItem } from "../controller/rule"
import { FormContext } from "../form/context"
import { BaseFiled, Field, FieldToJson, FormField } from "../form/field.type"
import { CFormConfig, FormConfig } from "../form/form.type"
import { Obj } from "../shared/type"
import { FieldValue } from "../shared/useFieldValue"

export type ArrayField = BaseFiled &
  FieldValue & {
    type: "ary"
    struct: Field[]
    setting: boolean
    userConfig: Obj
  }

export type ArrayActionSetValue = (index: number, e: any) => void
export type ArrayActionDelValue = (index: number) => void
export type ArrayActionSwap = (i1: number, i2: number) => void
export type ArrayActionPop = () => void
export type ArrayActionShift = () => void
export type ArrayActionPush = (e: unknown) => void
export type ArrayActionUnshift = (e: unknown) => void
export type ArrayActionClear = () => void

export type ArrayFieldActions = FormBaseActions & {
  setValue: ArrayActionSetValue
  delValue: ArrayActionDelValue
  swap: ArrayActionSwap
  pop: ArrayActionPop
  shift: ArrayActionShift
  push: ArrayActionPush
  unshift: ArrayActionUnshift
  clear: ArrayActionClear
}

export type ArrayFieldInitInfo = { initValue: unknown[]; formConfig: FormConfig }
export type ArrayFieldConfig<T = unknown> = { initValue?: T[]; toJson?: FieldToJson }
export type ArrayFieldInit<T> = (info: ArrayFieldInitInfo) => ArrayFieldConfig<T>

export type ArrayItemInitParams = { initValue: unknown }
export type ArrayItemConfig = {
  ctx: FormContext
  init: (p: ArrayItemInitParams) => { _field: FormField; _actions?: any }
  afterInit: (_field: any, ctx: FormContext, clean: Function) => unknown
  index: number
}

export interface CArrayFieldProps {
  name: string | number

  initValue?: any[]

  layout?: string | Record<any, any>
  layoutProps?: CFormItemProps

  element?: string | Record<any, any>
  props?: Record<any, any>
}

export interface CArrayFieldActions extends ArrayFieldActions {}

export interface CArrayFieldLayoutInfo {
  type: "array"
  fieldValue: ShallowRef<any[]>
  actions: CArrayFieldActions
  Rules: Record<any, (value: any) => CFormRuleItem>
  props: Record<any, any>
  layoutProps: CFormItemProps
  formConfig: CFormConfig
  fieldProps: Record<any, any>
  children: (p: { bind: Record<any, any>; props: Record<any, any> }) => any
}
