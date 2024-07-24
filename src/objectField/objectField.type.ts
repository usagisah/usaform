import { FormBaseActions } from "../actions/hooks"
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
