import { ArrayField } from "./arrayField"
import { RootField } from "./form"
import { ObjectField } from "./objectField"
import { PlainField } from "./plainField"

export interface FormConfig {
  defaultValue: any
  defaultFormData: Record<any, any>

  arrayItemBindKey: string

  [x: string]: any
}

export interface BaseFiled {
  name: FieldName
  __uform_field: boolean
}

export type Field = RootField | PlainField | ObjectField | ArrayField
export type FieldName = string | number

export function getProperty(target: any, key: FieldName) {
  try {
    return target[key]
  } catch {
    return null
  }
}
export function setProperty(target: any, key: FieldName, val: any) {
  try {
    target[key] = val
  } catch {}
}
