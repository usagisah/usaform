import { inject, onBeforeUnmount, provide, toRaw } from "vue"
import { useFormArrayItem } from "./arrayItem.js"
import { FormContext, GlobalInfo, formContext } from "./context.js"
import { BaseFiled, FieldName, FormConfig, getProperty } from "./form.common.js"
import { FormBaseActions } from "./form.js"

export type PlainFieldGetter = () => any
export type PlainFieldSetter = (value: any) => any
export type PlainFieldWatchHandler = (newValue: any, oldValue: any) => any
export type PlainFieldUnWatch = () => void
export type PlainFieldWatch = (handle: PlainFieldWatchHandler) => PlainFieldUnWatch
export type PlainFieldClearWatcher = () => void

export interface PlainField extends BaseFiled {
  type: "plain"
  value: any
  getter: PlainFieldGetter
  setter: PlainFieldSetter
  watch: PlainFieldWatch
  userConfig: Record<any, any>
}

export interface PlainFieldInitInfo {
  initValue?: any
  formConfig: FormConfig
  setValue: (v: any) => any
}

export interface PlainFieldConfig<T> {
  initValue: any
  bind?: T
  getter?: (value: any) => any
  setter?: (newValue: any, oldValue: any) => any
  [x: string]: any
}

export interface PlainFieldActions extends FormBaseActions {
  clearWatcher: PlainFieldClearWatcher
}

type PlainFieldInit<T> = (info: PlainFieldInitInfo) => PlainFieldConfig<T>

export function createPlainField(name: FieldName, { formConfig, currentInitValue, defaultValue }: FormContext, init: PlainFieldInit<any>, rest: Record<string, any> = {}) {
  const { initValue, bind, getter, setter, ...conf } = init({
    initValue: getProperty(currentInitValue, name) ?? defaultValue,
    ...rest,
    formConfig,
    setValue: (v: unknown) => {
      const oldValue = _field.value
      const newValue = (_field.value = toRaw(rest.setValue ? rest.setValue(v) : v))
      try {
        _w_handlers.forEach(f => f(newValue, oldValue))
      } catch (e) {
        console.error(e)
      }
      return newValue
    }
  })

  const _getter: PlainFieldGetter = () => {
    return typeof getter === "function" ? getter(_field.value) : _field.value
  }

  const _setter: PlainFieldSetter = (v: unknown) => {
    _field.value = typeof setter === "function" ? setter(v, _field.value) : v
  }

  const _w_handlers: PlainFieldWatchHandler[] = []
  const _watch: PlainFieldWatch = handler => {
    _w_handlers.push(handler)
    return () => {
      const i = _w_handlers.indexOf(handler)
      if (i > -1) _w_handlers.splice(i, 1)
    }
  }
  const _clearWatcher: PlainFieldClearWatcher = () => {
    _w_handlers.length = 0
  }

  const _field: PlainField = {
    type: "plain",
    name,
    value: initValue,
    getter: _getter,
    setter: _setter,
    watch: _watch,
    userConfig: conf,
    __uform_field: true
  }

  return { _field, _actions: { clearWatcher: _clearWatcher }, conf, bind }
}
export function useFormPlainField<T>(name: FieldName, init: PlainFieldInit<T>, params: any = {}): [T, PlainFieldActions] {
  const ctx: FormContext = inject(formContext)!
  const { field, actions } = ctx
  if (field.type === "plain") throw GlobalInfo.nullPlainField
  if (field.type === "ary") return useFormArrayItem({ ctx, init: p => createPlainField(name, ctx, init, p), params: { index: name, ...params } })
  const { _field, _actions, bind } = createPlainField(name, ctx, init)
  field.struct.set(name, _field)
  onBeforeUnmount(() => {
    field.struct.delete(name)
  })
  provide(formContext, null)
  return [bind, { ...actions, ..._actions }]
}
