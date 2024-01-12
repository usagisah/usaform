import { Field } from "../form.helper"
import { FieldSubscribeHandle } from "../useFieldValue"
import { callFieldAction } from "./call"
import { mapFieldToRecord } from "./mapToRecord"
import { resolveFields } from "./resolve"

export interface FormActionGetConfig {
  first?: boolean
  shallow?: boolean
}

export interface FormBaseActions {
  getFormData: () => Record<string, any>
  subscribe: (paths: string, handle: FieldSubscribeHandle) => () => void
  get: (path: string, config?: FormActionGetConfig) => any[]
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
      resolveFields(path, field, root, false).forEach(f => {
        unSubscribe.push(f.subscribe(handle))
      })
    }

    return () => {
      unSubscribe.forEach(f => f())
    }
  }

  function get(path: string, config?: FormActionGetConfig) {
    const _first = !!config?.first
    const _shallow = config?.shallow ?? true

    if (path.length === 0) return [field.getter()]
    const _fields = resolveFields(path, field, root, _first)

    if (_shallow) return _fields.map(f => f.getter())
    return _fields.map(mapFieldToRecord)
  }

  function set(path: string, value: any) {
    if (path.length === 0) return field.setter(value)
    resolveFields(path, field, root, false).forEach(f => f.setter(value))
  }

  function call(key: string, point: any, ...params: any[]) {
    return callFieldAction(field, key, point, params)
  }

  return { getFormData, subscribe, get, set, call }
}
