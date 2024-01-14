import { Ref, toRaw, unref } from "vue"
import { ArrayField } from "./arrayField"
import { ArrayItemInitParams } from "./arrayItem"
import { FormContext } from "./context"
import { RootField } from "./form"
import { ObjectField } from "./objectField"
import { PlainField } from "./plainField"
import { FieldValue } from "./useFieldValue"

export interface FormConfig {
  defaultValue?: any
  defaultFormData?: Record<any, any>
  arrayUnwrapKey?: string | string[]
  [x: string]: any
}

export interface BaseFiled extends FieldValue {
  name: FieldName
  parent?: Field | null
  __uform_field: boolean
  __aryValue?: any
  __uform_aryItem_field?: boolean
}

export type Field = RootField | PlainField | ObjectField | ArrayField
export type FieldName = string | number

export type FieldWrapper<T, A, Plain extends boolean> = {
  fieldValue: Ref<T>
  actions: A
  render: Plain extends false ? (fn: () => any) => any : null
}

export function isPlainObject(target: any): target is Record<string, any> {
  return Object.prototype.toString.call(target) === "[object Object]"
}

export function getProperty(target: any, key: FieldName, checkRaw = true) {
  if (checkRaw) target = toRaw(unref(target))
  try {
    const res = target[key]
    if (Array.isArray(res)) return [...res]
    if (isPlainObject(res)) return { ...res }
    return res
  } catch {
    return null
  }
}
export function setProperty(target: any, key: FieldName, val: any) {
  try {
    target[key] = val
  } catch {}
}

export function resolveFieldDefaultValue(name: FieldName, { currentInitValue, defaultValue }: FormContext, p?: ArrayItemInitParams) {
  if (p) return p.initValue
  return getProperty(currentInitValue, name) ?? defaultValue
}
