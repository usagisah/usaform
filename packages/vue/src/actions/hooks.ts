import { Field } from "../form.helper"
import { FieldSubscribeHandle } from "../useFieldValue"
import { callFieldAction } from "./call"
import { mapFieldToRecord } from "./mapToRecord"
import { resolveFields } from "./resolve"

export interface FormBaseActions {
  getFormData: () => Record<string, any>
  subscribe: (paths: string, handle: FieldSubscribeHandle) => () => void
  get: (path: string) => any[]
  set: (path: string, value: any) => void
  call: (key: string, point: any, ...params: any[]) => Record<string, any>
}

export function useFormActions(field: Field, root: Field): FormBaseActions {
  function getFormData(): Record<string, any> {
    return mapFieldToRecord(root)
  }

  function subscribe(path: string, handle: FieldSubscribeHandle) {
    const unSubscribe: Function[] = []
    if (path.length === 0) {
      unSubscribe.push(field.subscribe(handle))
    } else {
      resolveFields(path, field, root).forEach(f => {
        unSubscribe.push(f.subscribe(handle))
      })
    }

    return () => {
      unSubscribe.forEach(f => f())
    }
  }

  function get(path: string) {
    if (path.length === 0) return [field]
    return resolveFields(path, field, root).map(mapFieldToRecord)
  }

  function set(path: string, value: any) {
    if (path.length === 0) return field.setter(value)
    resolveFields(path, field, root).forEach(f => f.setter(value))
  }

  function call(key: string, point: any, ...params: any[]) {
    return callFieldAction(field, key, point, params)
  }

  return { getFormData, subscribe, get, set, call }
}
