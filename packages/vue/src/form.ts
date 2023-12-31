import { provide, toRaw } from "vue"
import { FormContext, formContext } from "./context"
import { BaseFiled, Field, FieldName, FormConfig } from "./form.helper"
import { FieldSubscribeHandle } from "./useFieldValue"

export interface RootField extends BaseFiled {
  type: "root"
  struct: Map<FieldName, Field>
}

export interface FormBaseActions {
  getFormData: () => Record<string, any>
  subscribe: (paths: string, handle: FieldSubscribeHandle) => () => void
  get: (path: string) => any[]
  set: (path: string, value: any) => void
  call: (key: string, point: any, ...params: any[]) => Record<string, any>
}

export interface FormActions extends FormBaseActions {
  provide: () => void
}

export function useForm(formConfig: Partial<FormConfig>) {
  const field = { type: "root", name: "root", struct: new Map(), __uform_field: true } as RootField

  function getFormData(): Record<string, any> {
    return mapFieldToRecord(field)
  }

  function subscribe(path: string, handle: FieldSubscribeHandle) {
    const unSubscribe: Function[] = []
    resolveFields(path, field).forEach(f => {
      unSubscribe.push(f.subscribe(handle))
    })
    return () => {
      unSubscribe.forEach(f => f())
    }
  }

  function get(path: string) {
    return resolveFields(path, field).map(mapFieldToRecord)
  }

  function set(path: string, value: any) {
    resolveFields(path, field).forEach(f => f.setter(value))
  }

  function call(key: string, point: any, ...params: any[]) {
    return callFieldAction(field, key, point, params)
  }

  const actions: FormBaseActions = { getFormData, subscribe, get, set, call }

  function formProvide() {
    const { defaultValue, defaultFormData, arrayItemBindKey } = toRaw(formConfig)
    provide(formContext, {
      field,
      defaultValue,
      currentInitValue: defaultFormData,
      arrayItemBindKey: arrayItemBindKey && arrayItemBindKey.length > 0 ? arrayItemBindKey : "value",
      actions,
      formConfig
    } as FormContext)
  }

  return { ...actions, provide: formProvide }
}

export function mapFieldToRecord(field: Field): Record<string, any> {
  if (field.type === "plain") return field.getter()
  if (field.type === "ary") return field.struct.map(mapFieldToRecord)
  const record: Record<string, any> = {}
  field.struct.forEach((field, name) => (record[name] = mapFieldToRecord(field)))
  return record
}

export function resolveFields(path: string, field: Field): Field[] {
  if (path.startsWith("/")) path = path.slice(1)
  if (path.endsWith("/")) path = path.slice(0, -1)

  const _path = path.split("/").map(v => new RegExp(v))
  const result: Field[] = []
  function resolve(path: RegExp[], field: Field) {
    if (path.length === 0) return result.push(field)
    const [p, ...ps] = path

    if (field.type === "root") {
      const names = [...field.struct.keys()].filter(k => p.test(k + ""))
      for (const name of names) resolve(ps, field.struct.get(name)!)
      return
    }

    if (field.type === "object") {
      if (path.length === 0) return field
      const names = [...field.struct.keys()].filter(k => p.test(k + ""))
      for (const name of names) resolve(ps, field.struct.get(name)!)
      return
    }

    if (field.type === "ary") {
      if (path.length === 0) return
      field.struct.forEach((f, i) => {
        if (!p.test(i + "")) return
        if (!f.__uform_field) return
        resolve(ps, f)
      })
      return
    }
  }
  resolve(_path, field)
  return result
}

export function callFieldAction(field: Field, key: string, point: any, params: any[]) {
  const results: Record<string, any> = {}
  function call(name: string, field: Field, path: string): unknown {
    if (field.type === "root") {
      return field.struct.forEach(f => call(f.name as string, f, ""))
    }

    const selfPath = path.length === 0 ? name.toString() : `${path}/${name}`
    try {
      const action = field.userConfig[key]
      if (typeof action === "function") {
        results[selfPath] = action.apply(point, [{ path: selfPath }, ...params])
      }
      if (field.type !== "plain") field.struct.forEach((f, i) => call(i.toString(), f, selfPath))
    } catch (e) {
      results[selfPath] = e
      console.error(e)
    }
  }
  call("root", field, "")
  return results
}
