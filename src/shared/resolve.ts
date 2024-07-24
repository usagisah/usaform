import { toRaw, unref } from "vue"
import { ArrayItemInitParams } from "../arrayField/arrayField.type"
import { FormContext } from "../form/context"
import { FieldName, NestField } from "../form/field.type"
import { isPlainObject } from "./check"

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

export function resolveFieldDefaultValue(name: FieldName, { currentInitValue }: FormContext, p?: ArrayItemInitParams) {
  return p ? p.initValue : getProperty(currentInitValue, name)
}

export function resolveArrayItem(target: Record<any, any>, arrayUnwrapKey: string[]) {
  for (const k of arrayUnwrapKey) {
    const v = target[k]
    if (v) return v
  }
  return target
}
