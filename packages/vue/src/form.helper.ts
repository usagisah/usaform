import { DefineComponent, Ref, toRaw, unref } from "vue"
import { ArrayField } from "./arrayField"
import { ArrayItemInitParams } from "./arrayItem"
import { FormContext } from "./context"
import { RootField } from "./form"
import { ObjectField } from "./objectField"
import { PlainField } from "./plainField"
import { VoidField } from "./voidField"

export interface FormConfig {
  defaultValue?: any
  defaultFormData?: Record<any, any>
  arrayUnwrapKey?: string | string[]
  toJson?: FieldToJson
  [x: string]: any
}

export type FieldToJson = () => Record<string, string | number | null | (string | number)[]>

export interface BaseFiled {
  name: FieldName
  order: number
  parent?: NestField | null
  toJson?: FieldToJson
  __uform_field: boolean
  __aryValue?: any
  __uform_aryItem_field?: boolean
}

export type FormField = RootField | PlainField | ObjectField | ArrayField
export type NestField = RootField | ObjectField | ArrayField
export type Field = FormField | VoidField
export type FieldName = string | number

export type FieldWrapper<T, A, Plain extends boolean> = {
  fieldValue: Ref<T>
  actions: A
  FieldRender: Plain extends false ? DefineComponent<{ render?: () => any }, any, any> : null
}

export function isPlainObject(target: any): target is Record<string, any> {
  return Object.prototype.toString.call(target) === "[object Object]"
}

export function getProperty(target: any, key: FieldName) {
  target = toRaw(unref(target))
  try {
    const res = target[key]
    if (Array.isArray(res)) return [...res]
    if (isPlainObject(res)) return { ...res }
    return res
  } catch {
    return null
  }
}
export function safeGetProperty(target: any, key: string) {
  try {
    return target[key]
  } catch {
    return target
  }
}
export function getFieldStructSize(target: NestField) {
  const { type, struct } = target
  return type === "ary" ? struct.length : struct.size
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

export function resolveArrayItem(target: Record<any, any>, arrayUnwrapKey: string[]) {
  for (const k of arrayUnwrapKey) {
    const v = target[k]
    if (v) return v
  }
  return target
}
