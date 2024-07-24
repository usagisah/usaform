import { FormBaseActions } from "../actions/hooks"
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
