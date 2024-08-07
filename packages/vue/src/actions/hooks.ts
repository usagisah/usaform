import { FormField } from "../form.helper"
import { FieldSubscribeConfig, FieldSubscribeHandle } from "../useFieldValue"
import { mapFieldToRecord } from "./mapToRecord"
import { resolveFields } from "./resolve"

export interface FormActionGetConfig {
  first?: boolean
  shallow?: boolean
}

export interface FormActionCallConfig {
  point?: any
  params?: any[]
  first?: boolean
  fieldTypes?: ("plain" | "object" | "ary" | "ary-item")[]
}
export interface FormActionCallInfo {
  name: string
  path: string
  [x: string | number | symbol]: any
}

export interface FormBaseActions {
  getFormData: () => Record<string, any>
  subscribe: (path: string, handle: FieldSubscribeHandle, config?: FieldSubscribeConfig) => () => void
  get: (path: string, config?: FormActionGetConfig) => Record<string, any>[]
  set: (path: string, value: any, method?: string) => void
  call: (path: string, key: string, config?: FormActionCallConfig) => Record<string, any>
}

export function useFormActions(field: FormField, rootField: FormField, arrayUnwrapKey: string[]): FormBaseActions {
  const getFormData = () => {
    return mapFieldToRecord(rootField, arrayUnwrapKey)
  }

  const subscribe: FormBaseActions["subscribe"] = (path, handle, config) => {
    const unSubscribe: Function[] = []
    if (path.length === 0) {
      unSubscribe.push(field.subscribe(handle, config))
    } else {
      resolveFields({ path, field, rootField, first: false }).forEach(({ field }) => {
        unSubscribe.push(field.subscribe(handle, config))
      })
    }
    return () => {
      unSubscribe.forEach(f => f())
    }
  }

  const get: FormBaseActions["get"] = (path, config) => {
    const _first = !!config?.first
    const _shallow = config?.shallow ?? true

    if (path.length === 0) return [field.getter()]
    const _fields = resolveFields({ path, field, rootField, first: _first })

    if (_shallow) return _fields.map(({ field }) => field.getter())
    return _fields.map(({ path, field }) => {
      return { [path]: mapFieldToRecord(field, arrayUnwrapKey) }
    })
  }

  const set: FormBaseActions["set"] = (path, value, method) => {
    if (path.length === 0) return field.setter(value)
    resolveFields({ path, field, rootField, first: false }).forEach(({ field }) => field.setter(value, method))
  }

  const call: FormBaseActions["call"] = (path, key, config) => {
    const { fieldTypes = [], first, point = globalThis, params = [] } = config ?? {}
    const _fields = path.length === 0 ? [{ path: "", name: field.name.toString(), field }] : resolveFields({ path, field, rootField, first: !!first })
    const result: Record<string, any> = {}
    _fields.forEach(({ path, name, field }) => {
      if (fieldTypes.includes(field.type as any) || (fieldTypes.includes("ary-item") && field.__uform_aryItem_field)) {
        const action = field.userConfig[key]
        try {
          if (typeof action === "function") {
            const info: FormActionCallInfo = { name, path }
            result[path] = action.apply(point, [info, ...params])
          }
        } catch (e) {
          result[path] = e
          console.error(e)
        }
      }
    })
    return result
  }

  return { getFormData, subscribe, get, set, call }
}
