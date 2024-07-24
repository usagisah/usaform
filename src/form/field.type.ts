import { DefineComponent, ShallowRef } from "vue"
import { ArrayField } from "../arrayField/arrayField.type"
import { ObjectField } from "../objectField/objectField.type"
import { PlainField } from "../plainField/plainField.type"
import { FieldValue } from "../shared/useFieldValue"
import { VoidField } from "../voidField/voidField.type"

export type FieldWrapper<T, A, Plain extends boolean> = {
  fieldValue: ShallowRef<T>
  actions: A
  FieldRender: Plain extends false ? DefineComponent<{ render?: () => any }, any, any> : null
}

export type RootField = BaseFiled &
  FieldValue & {
    type: "root"
    struct: Map<FieldName, Field>
    userConfig: Record<any, any>
  }
export type FormField = RootField | PlainField | ObjectField | ArrayField
export type NestField = RootField | ObjectField | ArrayField
export type Field = FormField | VoidField

export type FieldName = string | number

export type FieldToJson = () => Record<string, string | number | null | (string | number)[]>
export type BaseFiled = {
  name: FieldName
  order: number
  parent?: NestField
  toJson?: FieldToJson
  __uform_field: boolean
  __aryValue?: unknown
  __uform_aryItem_field?: boolean
}
